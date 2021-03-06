const express = require('express');
const app = express();
const morgan = require('morgan');
const auth = require('./routes/auth');
const jwt = require('./jwt');
const jokes = require('./routes/jokes');
const ratings = require('./routes/ratings');
const profiles = require('./routes/profiles');

// enhanced logging
app.use(morgan('dev'));
app.use(express.static('public'));
app.use(express.json());

// eslint-disable-next-line no-unused-vars
function checkAuth(req, res, next) {
  const token = req.get('Authorization');
  if(!token) {
    res.status(401).json({ error: 'no authorization found' });
    return;
  }
  let payload = null;
  try {
    payload = jwt.verify(token);
  }
  catch (err) {
    // this code runs when verify fails
    res.status(401).json({ error: 'invalid token' });
    return;  
  }
  req.userId = payload.id;
  next();
}

app.use('/api/auth', auth);
app.use('/api/ratings', checkAuth, ratings);
app.use('/api/jokes', checkAuth, jokes);
app.use('/api/profiles', checkAuth, profiles);

module.exports = app;