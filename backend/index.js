const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const db = require('./models/models')
const port = 8000

app.use(bodyParser.json())

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get('/', (request, response) => {
  response.json({ info: 'Todo List!' })
})

// List all tasks
app.get('/todolist', db.getAllTodoList)

// Detail one task
app.get('/todolist/:id', db.getTodoListById)

// Create a new Task with Status False (TODO) and validated e-mail
app.post('/todolist', db.createTodoList)

// API To add three random Tasks
app.post('/todolist/add/tasks', db.addTaskTodoList)
app.put('/todolist/:id', db.updateTodoList)

// Move Tasks - TODO to WIP to DONE
app.put('/todolist/:id/move', db.moveTaskTodoList)
app.delete('/todolist/:id', db.deleteTodoList)

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})
