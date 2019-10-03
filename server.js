const express = require('express')
const bodyParser = require('body-parser')
const bcrypt = require('bcryptjs')
const cors = require('cors')
const knex = require('knex')

const register = require('./controllers/register')
const signin = require('./controllers/signin')

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'Vandy',
    password : '',
    database : 'smart-brain'
  }
})

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.get('/', (req, res) => {
  res.send('Hellooo')
})

app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt) })

app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })

app.get('/profile/:id', (req, res) => {
  const { id } = req.params
  db.select('*').from('users').where({id})
  .then(user => {
    if (user.length) {
      res.json(user[0])
    } else {
      res.status(400).json('not found')
    }
  })
  .catch(err => res.status(400).json('error getting user'))
})

app.put('/image', (req, res) => {
  const { id } = req.body
  let found = false
  db('users').where('id', '=', id)
  .increment('entries', 1)
  .returning('entries')
  .then(entries => {
    res.json(entries[0])
  })
  .catch(err => res.status(400).json('unable to get entries'))
})

app.listen(3000, () => {
  console.log('app is running on port 3000')
})

