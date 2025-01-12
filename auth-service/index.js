const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const AWS = require("aws-sdk");
const { docClient } = require("./db.js");

app.use(bodyParser.json());
app.use(express.json());

const port = 3000;
const secretKey = "your_jwt_secret_key";

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token.split(" ")[1], secretKey);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid token" });
  }
};

// API Welcome msg - for testing
app.get("/api/v1/apitesting", (req, res) => {
  res.json({ msg: "Welcome to auth-service api" });
});

// Getting all users - need to delete later
app.get("/api/v1/allusers", async (req, res) => {
  const params = {
    TableName: "users",
  };

  try {
    const { Items = [] } = await docClient.scan(params).promise();
    res.status(200).json(Items); // Send fetched items as JSON response
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).send("Error fetching items123");
  }
});

// Registering Users
app.post("/api/v1/users", async (req, res) => {
  const { username, email, password } = req.body;
  const id = email;
  const hashedPassword = await bcrypt.hash(password, 10);

  const params = {
    TableName: "users",
    Item: {
      id,
      username,
      email,
      password: hashedPassword,
      watchlist: [],
      likedlist: [],
      role: "customer",
    },
  };

  try {
    const dynamoDB = new AWS.DynamoDB.DocumentClient();
    const response = await dynamoDB.put(params).promise();
    const token = jwt.sign({ id, username, role: "customer" }, secretKey, {
      expiresIn: "1h",
    });
    res
      .status(201)
      .json({ message: "User created successfully", token, response });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Could not create user", details: error.message });
  }
});

// Logging in users
app.post("/api/v1/login", async (req, res) => {
  const { email, password } = req.body;

  const params = {
    TableName: "users",
    FilterExpression: "email = :email",
    ExpressionAttributeValues: {
      ":email": email,
    },
  };

  try {
    const { Items } = await docClient.scan(params).promise();

    const user = Items[0];

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      secretKey,
      { expiresIn: "1h" }
    );
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: "Login failed", details: error.message });
  }
});

// Updating user
app.put("/api/v1/users/:id", async (req, res) => {
  const id = req.params.id;
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const params = {
    TableName: "users",
    Key: { id },
    UpdateExpression: "set username = :username, password = :password",
    ExpressionAttributeValues: {
      ":username": username,
      ":password": hashedPassword,
    },
    ReturnValues: "UPDATED_NEW",
  };

  try {
    const dynamoDB = new AWS.DynamoDB.DocumentClient();
    const result = await dynamoDB.update(params).promise();
    res.status(200).json({ message: "User updated successfully", result });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Could not update user", details: error.message });
  }
});

// Deleting user
app.delete("/api/v1/users/:id", async (req, res) => {
  const id = req.params.id;

  const params = {
    TableName: "users",
    Key: { id },
  };

  try {
    const dynamoDB = new AWS.DynamoDB.DocumentClient();
    await dynamoDB.delete(params).promise();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Could not delete user", details: error.message });
  }
});

app.listen(port, () => {
  console.log(`User Service running on port ${port}`);
});
