const express = require("express");
const app = express();

const AWS = require("aws-sdk");
const { docClient } = require("./db.js");

const port = 3001;

app.use(express.json());

// Fetching all videos
app.get("/api/v1/videos", async (req, res) => {
  const params = {
    TableName: "videos",
  };

  try {
    const { Items = [] } = await docClient.scan(params).promise();
    res.status(200).json(Items); // Send fetched items as JSON response
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).send("Error fetching items123");
  }
});

// Fetching a single video
app.get("/api/v1/videos/:id", async (req, res) => {
  const { id } = req.params;

  const params = {
    TableName: "videos",
    Key: { id },
  };

  try {
    const dynamoDB = new AWS.DynamoDB.DocumentClient();
    const { Items = [] } = await dynamoDB.scan(params).promise();

    const filterItems = Items.filter((vid) => vid.id === id);

    // const { Items = [] } = await docClient.get(params).promise();
    res.status(200).json(filterItems); // Send fetched items as JSON response
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).send("Error fetching items123");
  }
});

// Updating likes on a video
app.put("/api/v1/videos/:id", async (req, res) => {
  const id = req.params.id;
  const { incrementBy } = req.body;

  const params = {
    TableName: "videos",
    Key: { id },
    UpdateExpression: "SET likes = if_not_exists(likes, :start) + :inc",
    ExpressionAttributeValues: {
      ":inc": incrementBy || 1, // Default increment by 1 if not specified
      ":start": 0, // Initialize viewCount to 0 if it doesn't exist
    },
    ReturnValues: "UPDATED_NEW",
  };

  try {
    const dynamoDB = new AWS.DynamoDB.DocumentClient();
    const result = await dynamoDB.update(params).promise();
    res
      .status(200)
      .json({
        message: "View count updated",
        updatedAttributes: result.Attributes,
      });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Could not update likes", details: error.message });
  }
});

// Creating a new video entry in db
app.post("/api/v1/videos", async (req, res) => {
  const { id, cat, description, likes = 0, title, vidKey, role } = req.body;

  if (role === "customer") {
    return res
      .status(401)
      .json({ msg: "You are not authorized to create vidoes" });
  }

  const params = {
    TableName: "videos",
    Item: {
      id,
      cat,
      description,
      likes,
      title,
      vidKey,
    },
  };

  try {
    const dynamoDB = new AWS.DynamoDB.DocumentClient();
    const response = await dynamoDB.put(params).promise();
    // No response coming, need user details here including jwt token
    res.status(201).json({ message: "Video created successfully", response });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Could not create video", details: error.message });
  }
});

// Welcome API: Testing route
app.get("/api/v1/apitesting", async (req, res) => {
  res.status(200).json({ msg: "Welcome to video-service-api" });
});

app.listen(port, () => {
  console.log(`Video Service running on port ${port}`);
});
