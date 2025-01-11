const AWS = require('aws-sdk');
const DOC = require("dynamodb-doc");
require('dotenv').config();

// Configure AWS region and credentials
AWS.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const dynamoDB = new AWS.DynamoDB({ region: 'us-east-1' });
// const docClient = new AWS.DynamoDB.DocumentClient();
const docClient = new DOC.DynamoDB();

module.exports = { dynamoDB, docClient };
