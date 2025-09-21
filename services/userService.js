const jwt = require('jsonwebtoken');
const SECRET = 'supersecret';
const users = require('../models/userModel');

function registerUser({ username, password }) {
  if (!username || !password) throw new Error('Username and password required');
  if (users.find(u => u.username === username)) throw new Error('User already exists');
  users.push({ username, password });
  return { message: 'User registered' };
}

function loginUser({ username, password }) {
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) throw new Error('Invalid credentials');
  const token = jwt.sign({ username }, SECRET, { expiresIn: '1h' });
  return { token };
}

exports.register = (req, res) => {
  try {
    const result = registerUser(req.body);
    res.status(201).json(result);
  } catch (err) {
    if (err.message === 'User already exists') return res.status(409).json({ error: err.message });
    res.status(400).json({ error: err.message });
  }
};

exports.login = (req, res) => {
  try {
    const result = loginUser(req.body);
    res.json(result);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

exports.registerUser = registerUser;
exports.loginUser = loginUser;
