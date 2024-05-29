const express = require('express');
const app = express();
const { getTopics, getApi } = require('./controllers/api.controllers');


app.get('/api/topics', getTopics);


app.get('/api', getApi)

app.all('*', (req, res) => {
    res.status(404).send({ msg: "not found" });
});

app.use((error, req, res, next) => {
    res.status(error.status || 500).json({ message: error.msg || 'Internal Server Error' });
});

module.exports = app;
