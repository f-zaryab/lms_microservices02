const express = require('express');
const app = express();

const { docClient } = require('./config/db.js');


const port = 3001;

const videos = [
    { id: 1, title: "Introduction to Education portal", vidKey: "vid01.mp4", cat: "general", description: "A brief overview of the features and benefits of using the education portal for learning." },
    { id: 2, title: "Red blood cells", vidKey: "vid02.mp4", cat: "biology", description: "An informative video explaining the structure, function, and importance of red blood cells in the human body." },
    { id: 3, title: "Learning skills", vidKey: "vid03.mp4", cat: "general", description: "Tips and strategies to improve learning skills for students and lifelong learners." },
    { id: 4, title: "How Brain works", vidKey: "vid04.mp4", cat: "biology", description: "A detailed exploration of how the human brain functions, processes information, and controls the body." },
    { id: 5, title: "How people interact", vidKey: "vid05.mp4", cat: "sociology", description: "An insightful look into human interaction and communication in social contexts." },
    { id: 6, title: "Kids interest in studies", vidKey: "vid06.mp4", cat: "general", description: "Techniques and methods to cultivate and maintain children's interest in academic studies." },
    { id: 7, title: "Atom and planets", vidKey: "vid07.mp4", cat: "physics", description: "A comparison between the structure of atoms and the arrangement of planets in a solar system." },
    { id: 8, title: "The moon", vidKey: "vid08.mp4", cat: "space", description: "Fascinating facts and insights about the moon, its phases, and its influence on Earth." },
    { id: 9, title: "Learning 101", vidKey: "vid09.mp4", cat: "general", description: "A foundational guide to essential learning strategies and practices for beginners." },
    { id: 10, title: "Microcontroller", vidKey: "vid10.mp4", cat: "electronics", description: "An introduction to microcontrollers, their architecture, and their applications in embedded systems." },
    { id: 11, title: "Cat Running", vidKey: "vid11.mp4", cat: "general", description: "A fun and engaging video showing a cat running and its playful behavior." },
    { id: 12, title: "Earth", vidKey: "vid12.mp4", cat: "space", description: "An educational journey exploring the planet Earth, its composition, and its unique features." },
    { id: 13, title: "Periodic table", vidKey: "vid13.mp4", cat: "chemistry", description: "An overview of the periodic table, including elements, groups, and periodic trends." },
    { id: 14, title: "Structure of an atom", vidKey: "vid14.mp4", cat: "physics", description: "A detailed explanation of the structure of an atom, including protons, neutrons, and electrons." },
    { id: 15, title: "Impact of positive thinking", vidKey: "vid15.mp4", cat: "general", description: "An inspirational video discussing the benefits and impact of positive thinking on mental health and success." },
    { id: 16, title: "Coding", vidKey: "vid16.mp4", cat: "programming", description: "An introductory video to coding, programming languages, and basic coding concepts." },
    { id: 17, title: "Designing a webpage", vidKey: "vid17.mp4", cat: "programming", description: "A tutorial on designing a webpage using HTML, CSS, and basic layout techniques." }
];


// Fetching all videos
app.get('/api/v1/videos', async (req, res) => {
    const params = {
        TableName: 'videos',
    };

    try {
        const { Items = [] } = await docClient.scan(params).promise();
        res.status(200).json(Items); // Send fetched items as JSON response
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).send('Error fetching items123');
    }
});

app.get('/api/v1/vid', async (req, res) => {
    res.status(200).json(videos);
});

app.listen(port, () => {
    console.log(`Video Service running on port ${port}`);
});