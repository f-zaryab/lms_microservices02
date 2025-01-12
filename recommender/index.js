const express = require("express");
const app = express();

const { docClient } = require("./db.js");

const port = 3002;

// What others are watching: based on likes on videos
app.get("/api/v1/recom", async (req, res) => {
  const params = {
    TableName: "videos",
  };

  try {
    const { Items = [] } = await docClient.scan(params).promise();
    const filteredItems = Items.filter((vid) => vid.likes > 5);
    res.status(200).json(filteredItems);
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).send("Error fetching items123");
  }
});

// API Welcome path for testing
app.get("/api/v1/apitesting", async (req, res) => {
  res.status(200).json({ msg: "Welcome to recommender api." });
});

app.listen(port, () => {
  console.log(`Video Service running on port ${port}`);
});
