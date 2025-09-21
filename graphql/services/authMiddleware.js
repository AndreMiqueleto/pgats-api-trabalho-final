const jwt = require('jsonwebtoken');
const SECRET = 'supersecret';

exports.authMiddleware = (req) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return {};
  const token = authHeader.split(' ')[1];
  try {
    const user = jwt.verify(token, SECRET);
    return { user };
  } catch {
    return {};
  }
};
