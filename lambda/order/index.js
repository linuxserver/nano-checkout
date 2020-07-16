const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const ses = new AWS.SES();
const YAML = require('yaml');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const async = require("async");
const fetch = require('node-fetch');
const NanoCurrency = require('nanocurrency');
const neturls = {lsio:'https://wallet.linuxserver.io/#/nano.linuxserver.io/',live:'https://tixwallet.cc/#/'};
const formendpoint = 'https://www.nanocheckout.com/templates/';

exports.handler = async function(event, context, callback) {
  const networks = {
    lsio: {
      url: 'https://nano.linuxserver.io:7077'
    },
    live: {
      url: 'https://proxy.nanos.cc/proxy',
      headers: {
        'Content-Type': 'application/json'
      }
    }
  };
  const responseCode = 200;
  if (event.queryStringParameters !== null && event.queryStringParameters !== undefined && event.queryStringParameters.trans) {
    let buff = Buffer.from(event.body, 'utf-8');
    const length = Buffer.byteLength(buff);
    if (length > 16384) {
      const responseBody = {
        action: 'none',
        message: 'Body to long, limit 16384 bytes'
      };
      await respond(responseBody);
    }
    const trans = event.queryStringParameters.trans;
    try {
      await s3.headObject({
        Bucket: "nanocheckout-orders", 
        Key: trans
      }).promise();
      const responseBody = {
        action: 'none',
        message: 'This transaction has allready been used for an order: ' + trans
      };
      await respond(responseBody);
    } catch (e) {
      try {
        const metadatas3 = await s3.getObject({
          Bucket: "nanometadata.com", 
          Key: trans
        }).promise();
        const metadata = metadatas3.Body.toString('utf-8').substring(192);
        const hash = crypto.createHash('sha256').update(event.body).digest('hex');
        if (hash == metadata){
          try {
            JSON.parse(event.body);
          } catch(e) {
            const responseBody = {
              action: 'none',
              message: 'Invalid JSON in payload'
            };
            await respond(responseBody);
          }
          const payloadjson = JSON.parse(event.body);
          if (payloadjson.formurl && payloadjson.net && payloadjson.transactionhash) {
            const re = /^[A-F\d]{8}-[A-F\d]{4}-4[A-F\d]{3}-[89AB][A-F\d]{3}-[A-F\d]{12}$/i;
            if (payloadjson.formurl.startsWith(formendpoint) && re.test(payloadjson.formurl.replace(formendpoint,''))) {
              const formid = payloadjson.formurl.replace(formendpoint,'');
              try {
                const forms3 = await s3.getObject({
                  Bucket: "nanocheckout.com", 
                  Key: 'templates/' + formid
                }).promise();
                const form = YAML.parse(forms3.Body.toString('utf-8'));
                const emails3 = await s3.getObject({
                  Bucket: "nanocheckout-federation", 
                  Key: formid
                }).promise();
                const email = emails3.Body.toString('utf-8');
                const postbody = {
                  action: 'block_info',
                  json_block: 'true',
                  hash: trans
                };
                const rpcres = await rpCall(networks[form.net],postbody);
                const blockamount = NanoCurrency.convert(rpcres.amount,{from:'raw',to:'Nano'});
                const subtype = rpcres.subtype;
                const blockdestination = rpcres.contents.link_as_account;
                const blocksource = rpcres.block_account;
                const pricestring = form.price.toString();
                if (pricestring.startsWith('.')){
                   const pricestring = '0' + pricestring;
                }
                if (blockamount == pricestring && subtype == 'send' && blockdestination.split('_')[1] == form.destination.split('_')[1]) {
                  try {
                    const orderid = uuidv4();
                    const explorerurl = neturls[form.net];
                    let decodedpayload = {};
                    async.forEachOf(payloadjson, function(item, key, callback){
                      if (key == 'transactionhash' || key == 'net' || key == 'formurl') {
                        decodedpayload[key] =item;
                        callback();
                      } else {
                        decodedpayload[key] = new Buffer(item, 'base64').toString('utf-8');
                        callback();
                      }
                    });
                    let body = {};
                    body['orderid'] = orderid;
                    body['source'] = blocksource;
                    body['product'] = form.product;
                    body['productid'] = form.productid;
                    body['destination'] = explorerurl + 'address/' + form.destination;
                    body['price'] = form.price;
                    body['blockexplore'] = explorerurl + 'block/' + trans;
                    body['metadata'] = 'https://www.nanometadata.com/' + trans;
                    body['payloadvalues'] = decodedpayload;
                    body['rawpayload'] = event.body;
                    const emailsubject = 'Order Received #' + orderid + ' for ' + form.product;
                    const emailbodytext = YAML.stringify(body);
                    const emailbodyhtml = YAML.stringify(body).split("\n").join("<br />") + '<br />To stop receiving emails for this template please visit https://www.nanocheckout.com/#/delete/' + formid + ' and click delete';
                    await ses.sendEmail({
                      Destination: {
                       ToAddresses: [email]
                      },
                      Message: {
                       Body: {
                        Html: {
                         Charset: 'UTF-8', 
                         Data: emailbodyhtml
                        }, 
                        Text: {
                         Charset: 'UTF-8', 
                         Data: emailbodytext
                        }
                       }, 
                       Subject: {
                        Charset: 'UTF-8', 
                        Data: emailsubject
                       }
                      }, 
                      ReplyToAddresses: ["orders@nanocheckout.com"], 
                      Source: "orders@nanocheckout.com"
                    }).promise();
                    await s3.putObject({
                      Bucket: 'nanocheckout-orders',
                      Key: orderid,
                      ContentType:'text/plain',
                      Body: Buffer.from(event.body, 'binary')
                    }).promise();
                    await s3.putObject({
                      Bucket: 'nanocheckout-orders',
                      Key: trans,
                      ContentType:'text/plain',
                      Body: Buffer.from(event.body, 'binary')
                    }).promise();
                    const responseBody = {
                      action: 'success',
                      message: orderid
                    };
                    await respond(responseBody);
                  } catch (e) {
                    const responseBody = {
                      action: 'none',
                      message: 'Could not email store owner save your receipt'
                    };
                    await respond(responseBody);
                  }
                } else {
                  const responseBody = {
                    action: 'none',
                    message: 'Invalid block parameters sent for form'
                  };
                  await respond(responseBody);
                }
              } catch(e) {
                const responseBody = {
                  action: 'none',
                  message: 'Form Not found'
                };
                await respond(responseBody);
              }
            } else {
              const responseBody = {
                action: 'none',
                message: 'Invalid form url'
              };
              await respond(responseBody);
            }
          } else {
            const responseBody = {
              action: 'none',
              message: 'Payload is missing required parameters'
            };
            await respond(responseBody);
          }
        } else {
          const responseBody = {
            action: 'none',
            message: 'Metadata hash does not match payload'
          };
          await respond(responseBody);
        }
      } catch (e) {
        const responseBody = {
          action: 'none',
          message: 'No metadata found for this transaction: ' + trans
        };
        await respond(responseBody);
      }
    }
  } else {
    const responseBody = {
      action: 'none',
      message: 'No parameters passed this endpoint requires ?trans=<yourtransactionhash>'
    };
    await respond(responseBody);
  }
  async function rpCall (nodeinfo, body) {
    var rpcurl = nodeinfo.url;
    var Init = { method:'POST',body: JSON.stringify(body)};
    Init.headers = {};
    if ('headers' in nodeinfo) {
      Init.headers = nodeinfo.headers;
    }
    if (nodeinfo.auth !== null) {
      Init.headers['Authorization'] = nodeinfo.auth;
    }
    var res = await fetch(rpcurl,Init);
    var data = await res.json();
    return data;
  }
  async function respond(responseBody) {
    console.log(responseBody);
    const response = {
      statusCode: responseCode,
      headers: {'Access-Control-Allow-Origin':'*'},
      body: JSON.stringify(responseBody, null, 4)
    };
    callback(null, response);
  }
  
};
