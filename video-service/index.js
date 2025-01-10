const express = require('express');
const app = express();
const port = 3001;

const videos = [
    { id: 1, title: 'Introduction to Education portal', vidKey: "vid01.mp4", cat: "general" },
    { id: 2, title: 'Red blood cells', vidKey: "vid02.mp4", cat: "biology" },
    { id: 3, title: 'Learning skills', vidKey: "vid03.mp4", cat: "general" },
    { id: 4, title: 'How Brain works', vidKey: "vid04.mp4", cat: "biology" },
    { id: 5, title: 'How people interact', vidKey: "vid05.mp4", cat: "sociology" },
    { id: 6, title: 'Kids interest in studies', vidKey: "vid06.mp4", cat: "general" },
    { id: 7, title: 'Atom and planets', vidKey: "vid07.mp4", cat: "physics" },
    { id: 8, title: 'The moon', vidKey: "vid08.mp4", cat: "space" },
    { id: 9, title: 'Learning 101', vidKey: "vid09.mp4", cat: "general" },
    { id: 10, title: 'Microcontroller', vidKey: "vid10.mp4", cat: "electronics" },
    { id: 11, title: 'Cat Running', vidKey: "vid11.mp4", cat: "general" },
    { id: 12, title: 'Earth', vidKey: "vid12.mp4", cat: "space" },
    { id: 13, title: 'Periodic table', vidKey: "vid13.mp4", cat: "chemistry" },
    { id: 14, title: 'Structure of an atom', vidKey: "vid14.mp4", cat: "physics" },
    { id: 15, title: 'Impact of positive thinking', vidKey: "vid15.mp4", cat: "general" },
    { id: 16, title: 'Coding', vidKey: "vid16.mp4", cat: "programming" },
    { id: 17, title: 'Designing a webpage', vidKey: "vid17.mp4", cat: "programming" },
];

app.get('/videos', (req, res) => {
    res.json(videos);
});

app.listen(port, () => {
    console.log(`Video Service running on port ${port}`);
});