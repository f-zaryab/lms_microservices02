const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const AWS = require('aws-sdk');
const { docClient } = require('./config/db.js');

app.use(bodyParser.json());

const port = 3000;

const users = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
];

app.get('/api/v1/users', (req, res) => {
  res.json(users);
});

// Getting all users - need to delete later
app.get('/api/v1/allusers', async (req, res) => {
  const params = {
    TableName: 'users',
  };

  try {
    const { Items = [] } = await docClient.scan(params).promise();
    res.status(200).json(Items); // Send fetched items as JSON response
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).send('Error fetching items123');
  }
});

// Registering Users
app.post('/api/v1/users', async (req, res) => {
  const { username, email, password } = req.body;
  const id = uuidv4();

  const params = {
    TableName: 'users',
    Item: {
      id,
      username,
      email,
      password,
      watchlist: [],
      likedlist: [],
      role: "customer"
    }
  };

  try {
    const dynamoDB = new AWS.DynamoDB.DocumentClient();
    const response = await dynamoDB.put(params).promise();
    // No response coming, need user details here including jwt token
    res.status(201).json({ message: 'User created successfully', response });
  } catch (error) {
    res.status(500).json({ error: 'Could not create user', details: error.message });
  }
});

// Updating user
app.put('/api/v1/users/:id', async (req, res) => {
  const id = req.params.id;
  const { username, password, } = req.body;

  const params = {
    TableName: 'users',
    Key: { id },
    UpdateExpression: 'set username = :username, password = :password',
    ExpressionAttributeValues: {
      ':username': username,
      ':password': password
    },
    ReturnValues: 'UPDATED_NEW'
  };

  try {
    const dynamoDB = new AWS.DynamoDB.DocumentClient();
    const result = await dynamoDB.update(params).promise();
    res.status(200).json({ message: 'User updated successfully', result });
  } catch (error) {
    res.status(500).json({ error: 'Could not update user', details: error.message });
  }
});

// Deleting user
app.delete('/api/v1/users/:id', async (req, res) => {
  const id = req.params.id;

  const params = {
    TableName: 'users',
    Key: { id }
  };

  try {
    const dynamoDB = new AWS.DynamoDB.DocumentClient();
    await dynamoDB.delete(params).promise();
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Could not delete user', details: error.message });
  }
});

app.listen(port, () => {
  console.log(`User Service running on port ${port}`);
});
