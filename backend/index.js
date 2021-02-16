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
  response.json({ info: 'Node.js, Express, and Postgres API' })
})

app.get('/todolist', db.getAllTodoList)
app.get('/todolist/:id', db.getTodoListById)
app.post('/todolist', db.createTodoList)
app.post('/todolist/add/tasks', db.addTaskTodoList)
app.put('/todolist/:id', db.updateTodoList)
app.put('/todolist/:id/move', db.moveTaskTodoList)
app.delete('/todolist/:id', db.deleteTodoList)

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})
