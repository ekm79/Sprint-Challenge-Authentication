const axios = require('axios');
const bcrypt = require('bcryptjs');
const db = require('./../database/dbConfig');
const jwt = require('jsonwebtoken');
const jwtKey = require('../_secrets/keys').jwtKey;

const { authenticate } = require('./middlewares');

module.exports = server => {
  server.post('/api/register', register);
  server.post('/api/login', login);
  server.get('/api/jokes', checkLogIn, getJokes);
  server.get('/api/users', getUsers);
};


function register(req, res) {
  const credentials = req.body;
  const hash = bcrypt.hashSync(credentials.password, 14);
  credentials.password = hash;
  db('users')
  .insert(credentials)
  .then(function(ids) {
    db('users')
    .where({id: ids[0]})
    .first()
    .then(user => {
      const token = generateToken(user);
      console.log(token);
      res.status(201).json(token);
    })
  })
  .catch(err => {
    res.status(500).json(err);
  })
  // implement user registration
}

function login(req, res) {
  const credentials = req.body;
  db('users')
  .where({username: credentials.username})
  .first()
  .then(function(user) {
    if(user && bcrypt.compareSync(credentials.password, user.password)) {
      const token = generateToken(user);
      res.status(200).json(token);
      console.log(token);
    }
    else{
      return res.status(401).json({error: 'unauthorized'})
    }
  })
  .catch(err => {
    res.status(500).json({error: 'There was an error logging in'})
  })
  // implement user login
}

function getJokes(req, res) {
  axios
    .get(
      'https://08ad1pao69.execute-api.us-east-1.amazonaws.com/dev/random_ten'
    )
    .then(response => {
      res.status(200).json(response.data);
    })
    .catch(err => {
      res.status(500).json({ message: 'Error Fetching Jokes', error: err });
    });
}

function getUsers(req, res) {
  db('users').select('username', 'password')
  .then(user => {
          res.status(200).json(user)
  })
  .catch(err => {
      res.status(500).json({error: 'You shall not pass!'})
  })
}

function generateToken(user) {
  const payload = {
      username: user.username,
      password: user.password,
  }
  const options = {
      expiresIn: '1d',
      }
      return jwt.sign(payload, jwtKey, options)
}

function checkLogIn (req, res, next) {
  const token = req.headers.authorization;
  if(token) {
      jwt.verify(token, jwtKey, (err, decodedToken) => {
          next()
      })
  }else {
      return res.status(401).json({error: 'Incorrect credentials'})
  }
}