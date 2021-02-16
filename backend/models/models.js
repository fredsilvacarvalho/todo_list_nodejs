const Pool = require('pg').Pool
const axios = require("axios")
const API_KEY = '04f90fb21734c7db6d1e0448a31cbd04'
const MAIL_CHECK_URL = 'https://apilayer.net/api/check?access_key=' + API_KEY
const CAT_FACTS_URL = 'https://cat-fact.herokuapp.com/facts/random?animal_type=dog&amount=3'
const util = require('util')

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'todo_list',
  password: 'root',
  port: 5432,
})

const getAllTodoList = (request, response) => {
  pool.query('SELECT * FROM tasks ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getTodoListById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT * FROM tasks WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const createTodoList = (request, response) => {
  const { description, name, email } = request.body

  validatedEmail(email).then((valid) => {
      if (valid){
        pool.query('INSERT INTO tasks (description, name, email, status) VALUES ($1, $2, $3, false)', [description, name, email], (error, results) => {
          if (error) {
            throw error
          }
          response.status(201).send(`Task added with Description: ${description}`)
        })
      } else {
        response.status(400).json({ error: 'Invalid e-mail.' })
      }
  }).catch(err => console.log("API Error: ", err))
}

const updateTodoList = (request, response) => {
  const id = parseInt(request.params.id)
  const { description, name, email } = request.body

  pool.query(
    'UPDATE tasks SET description = $1 name = $2, email = $3 WHERE id = $4',
    [description, name, email, id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`Task modified with ID: ${id}`)
    }
  )
}

const moveTaskTodoList = (request, response) => {
  const id = parseInt(request.params.id)
  const { status } = request.body

  pool.query(
    'UPDATE tasks SET status = $1',
    [status, id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`Task moved with ID: ${id}`)
    }
  )
}

const deleteTodoList = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM tasks WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`Task deleted with ID: ${id}`)
  })
}

const addTaskTodoList = (request, response) => {
  const name = 'Eu'
  const email = 'eu@me.com'

  getDogsFactsTask().then((descriptions) => {
    console.log(descriptions)
    if (descriptions.length >= 3){
      pool.query('INSERT INTO tasks (description, name, email, status) VALUES ($1, $2, $3, true)', [descriptions[0], name, email], (error, results) => {
        if (error) {
          throw error
        }
      })

      pool.query('INSERT INTO tasks (description, name, email, status) VALUES ($1, $2, $3, true)', [descriptions[1], name, email], (error, results) => {
        if (error) {
          throw error
        }
      })

      pool.query('INSERT INTO tasks (description, name, email, status) VALUES ($1, $2, $3, true)', [descriptions[2], name, email], (error, results) => {
        if (error) {
          throw error
        }
        response.status(201).send(`Task added with Descriptions: ${descriptions}`)
      })
    } else {
      response.status(400).json({ error: 'Tasks size invalid!' })
    }
}).catch(err => console.log("API Error: ", err))
}

function validatedEmail(email) {
  return axios.get(MAIL_CHECK_URL + '&email=' + email)
    .then((response) => {
      return response.data.format_valid
    })
    .catch(error => {
      console.log(error);
  });
}

function getDogsFactsTask() {
  return axios.get(CAT_FACTS_URL)
    .then((response) => {
      array = response.data
      descriptionArray = []
      for(var value in array) {
        var item = array[value];
        for(var key in item) {
          if (key === 'text'){
            console.log(item[key])
            descriptionArray.push(item[key]);
          }
        }
      }
      return descriptionArray
    })
    .catch(error => {
      console.log(error);
  });
}

module.exports = {
  getAllTodoList,
  getTodoListById,
  createTodoList,
  updateTodoList,
  deleteTodoList,
  addTaskTodoList,
  moveTaskTodoList,
  validatedEmail,
  getDogsFactsTask,
}
