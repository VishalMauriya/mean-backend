const express = require('express');
const app = express();
const mongoose = require('./database/connection');

const List = require('./database/models/list');
const Task = require('./database/models/task');
app.use(express.json());

app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PATCH,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

/* LISTS */

app.get('/lists', (req, res) =>{
    List.find({})
    .then(lists => res.send(lists))
    .catch((error) => console.log(error));
});

app.post('/lists', (req, res) => {
    (new List({'title' : req.body.title}))
    .save()
    .then(list => res.send(list))
    .catch((error) => console.log(error));
});

app.get('/lists/:listId', (req, res) => {
    List.find({_id : req.params.listId})
    .then(lists => res.send(lists))
    .catch((error) => console.log(error));
});

app.patch('/lists/:listId', (req, res) => {
    List.findOneAndUpdate({_id : req.params.listId}, {$set : req.body})
    .then(lists => res.send(lists))
    .catch((error) => console.log(error));
});

app.delete('/lists/:listId', (req, res) => {
    const deleteTasks = (list) => {
        Task.deleteMany({_listid : list._id})
        .then(() => list)
        .catch((error) => console.log(error));
    };

    const list = List.findOneAndDelete({_id : req.params.listId})
    .then(list => deleteTasks(list))
    .catch((error) => console.log(error));

    res.send(list);
});

/* TASKS */

app.get('/lists/:listId/tasks', (req, res) =>{
    Task.find({_listid : req.params.listId})
    .then(tasks => res.send(tasks))
    .catch((error) => console.log(error));
});

app.post('/lists/:listId/tasks', (req, res) => {
    (new Task({'title' : req.body.title, '_listid' : req.params.listId}))
    .save()
    .then(task => res.send(task))
    .catch((error) => console.log(error));
});

app.get('/lists/:listId/tasks/:taskId', (req, res) =>{
    Task.find({_listid : req.params.listId, _id : req.params.taskId})
    .then(task => res.send(task))
    .catch((error) => console.log(error));
});

app.patch('/lists/:listId/tasks/:taskId', (req, res) =>{
    Task.findOneAndUpdate({_listid : req.params.listId, _id : req.params.taskId}, {$set : req.body})
    .then(task => res.send(task))
    .catch((error) => console.log(error));
});

app.delete('/lists/:listId/tasks/:taskId', (req, res) =>{
    Task.findOneAndDelete({_listid : req.params.listId, _id : req.params.taskId})
    .then(task => res.send(task))
    .catch((error) => console.log(error));
});

app.listen(3000, () => console.log("Server connected on http://localhost:3000/"));