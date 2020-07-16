const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const ses = new AWS.SES();
const CLIENT_ID = process.env.CLIENT_ID;
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);
const YAML = require('yaml');
const { v4: uuidv4 } = require('uuid');
const NanoCurrency = require('nanocurrency');
const validnets = ['lsio','live'];

exports.handler = async function(event, context, callback) {
  const responseCode = 200;
  if (event.queryStringParameters !== null && event.queryStringParameters !== undefined && event.queryStringParameters.type && event.queryStringParameters.token) {
    const tokenemail = await checkemailfromtoken().catch( async function(e) {
      const responseBody = {
        action: 'none',
        message: 'Invalid Token'
      };
      await respond(responseBody);
    });
    let buff = Buffer.from(event.body, 'utf-8');
    const length = Buffer.byteLength(buff);
    if (length > 4096) {
      const responseBody = {
        action: 'none',
        message: 'Body to long, limit 4096 bytes'
      };
      await respond(responseBody);
    }
    if (event.queryStringParameters.type == 'upload') {
      const formyaml = YAML.parse(event.body);
      if (formyaml.product && formyaml.productid && NanoCurrency.checkAddress(formyaml.destination) && ! Number.isNaN(parseInt(formyaml.price)) && validnets.includes(formyaml.net) && (Array.isArray(formyaml.inputs) && formyaml.inputs.length > 0)) {
        if (formyaml.inputs.length > 13) {
          const responseBody = {
            action: 'none',
            message: 'Too many Inputs'
          };
          await respond(responseBody);
        }
        const id = uuidv4();
        const sesverification = await ses.getIdentityVerificationAttributes({
          Identities: [
            tokenemail
          ]
        }).promise();
        if (! sesverification.VerificationAttributes[tokenemail]) {
          await ses.verifyEmailIdentity({
            EmailAddress: tokenemail
          }).promise();
        }
        await s3.putObject({
          Bucket: 'nanocheckout.com',
          Key: 'templates/' + id,
          ContentType:'text/plain',
          Body: Buffer.from(YAML.stringify(formyaml), 'binary')
        }).promise();
        await s3.putObject({
          Bucket: 'nanocheckout-federation',
          Key: id,
          ContentType:'text/plain',
          Body: Buffer.from(tokenemail, 'binary')
        }).promise();
        await s3.putObject({
          Bucket: 'nanocheckout-federation',
          Key: 'backup/' + id,
          ContentType:'text/plain',
          Body: Buffer.from(YAML.stringify(formyaml), 'binary')
        }).promise();
        const responseBody = {
          action: 'success',
          message: id
        };
        respond(responseBody);
      } else {
        const responseBody = {
          action: 'none',
          message: 'Malformed Yaml'
        };
        await respond(responseBody);
      }
    } else if (event.queryStringParameters.type == 'delete') {
      const guid = event.body;
      try {
        const s3object = await s3.getObject({
          Bucket: 'nanocheckout-federation',
          Key: guid
        }).promise();
        const email = s3object.Body.toString('utf-8');
        if (tokenemail == email) {
          await s3.deleteObject({
            Bucket: 'nanocheckout-federation',
            Key: guid
          }).promise();
          await s3.deleteObject({
            Bucket: 'nanocheckout.com',
            Key: 'templates/' + guid
          }).promise();
          const responseBody = {
            action: 'success',
            message: guid
          };
          await respond(responseBody);
        } else {
          const responseBody = {
            action: 'none',
            message: 'Invalid user'
          };
          await respond(responseBody);
        }
      } catch (e) {
        const responseBody = {
          action: 'none',
          message: 'Form not found'
        };
        await respond(responseBody);
      }
    }
  } else {
    const responseBody = {
      action: 'none',
      message: 'No parameters passed this endpoint requires ?token=<yourgoogleauthtoken>&type=<upload or delete>'
    };
    await respond(responseBody);
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
  async function checkemailfromtoken() {
    console.log(event.queryStringParameters.token,CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: event.queryStringParameters.token,
      audience: CLIENT_ID
    });
    const payload = ticket.getPayload();
    if (payload.iss == 'accounts.google.com' || payload.iss == 'https://accounts.google.com') {
      return payload.email;
    } else {
      throw Error();
    }
  }
  
};
