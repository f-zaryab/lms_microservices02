const AWS = require('aws-sdk');
const DOC = require("dynamodb-doc");
require('dotenv').config();

// Configure AWS region and credentials
AWS.config.update({
    region: "us-east-1",
    accessKeyId: "ASIAZLECMYTHWAARJX2I",
    secretAccessKey: "duXBWwe6vx/chP0CIY+rK5E+q0r4StQO5S/Y8VW0"
});

const dynamoDB = new AWS.DynamoDB({ region: 'us-east-1' });
// const docClient = new AWS.DynamoDB.DocumentClient();
const docClient = new DOC.DynamoDB();

module.exports = { dynamoDB, docClient };
