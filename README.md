# Nano Checkout

**This system only facilitates data being pushed from a wallet to another user, do not contact us about lost funds or scams. We never handle funds!**

Nano Checkout is a non custodial checkout system designed to securely broker a data payload from a user sending Nano to the person receiving the funds. The system is comprised of 3 parts and a compatible wallet. 
1. Browser based formbuilder allowing the person selling a good or service to generate a custom tailored checkout form.
2. Yaml upload API allowing authentication and translating a posted yaml file into a hosted one at an ingestible endpoint.
3. Order API where transaction details are sent by the wallet and then emailed to the template owner. 

# Server side components

If you want to host this yourself you need to have a basic underlying understanding of AWS and it's services the full stack is a combination of:
* AWS Cloudfront - Used to serve template Yaml for ingestion wallet side
* AWS S3 - Backend data storage behind Coudfront
* AWS API Gateway - Used to provide an https endpoint the server side component can be invoked with in a scaling horizontal manner
* AWS Lambda - The actual invocation of the code to authenticate form owners and verify order payloads against blockchain information and metadata

## Authentication and Yaml hosting

Authentication is based around Google oauth as we need to verify the user uploading templates actually owns the email address we will be sending orders to. 

The API for this upload function has two very simple calls to either upload posted body info as a yaml file or delete a template by ID with their accompanying google token for verification.

The code for this endpoint can be found in the `/lambda/yaml/` directory of this repository.

## Ingesting an order from a users Wallet and dispatching emails

When a client sends us a payload it is linked to a transaction hash. Server side we: 

1. Sha256sum the data payload
2. Ingest the hash from nanometadata.com and compare shasum, if matching proceed to block verification
3. Pull in the block info for this transaction and make sure the values the client sent us line up specifically the payment amount and destination
4. Convert the payload into a human and machine readable email and send via SES to the template holder

The code for this enpoint can be found in the `/lambda/order/` directory of this repository.

# Clientside form building

This is the main project in this repo, outside of the APIs mentioned above all logic runs from the web browser. Once logged in via Gmail the process of building a form should be self explanatory. Presets are provided in the form of: 

* Email - Email text input with basic regexp validation
* Name - Name input with pre-determined placeholder
* Address - Standard address inputs with international country and region selects

Outside of these presets you can also make any custom text input you want and require them, though no complex form validation is available for these type of inputs simply a required or not required. 

## Development environment
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
