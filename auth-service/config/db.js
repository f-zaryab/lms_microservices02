const AWS = require('aws-sdk');
const DOC = require("dynamodb-doc");

// Configure AWS region and credentials
AWS.config.update({
    region: "us-east-1"
});

const dynamoDB = new AWS.DynamoDB();
// const docClient = new AWS.DynamoDB.DocumentClient();
const docClient = new DOC.DynamoDB();

module.exports = { dynamoDB, docClient };
