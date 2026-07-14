const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authentication token is required' });
  }

  const token = authorizationHeader.slice(7).trim();
  if (!token) {
    return res.status(401).json({ success: false, message: 'Authentication token is required' });
  }

  try {
    if (!process.env.JWT_SECRET) {
      const configurationError = new Error('JWT_SECRET is not configured');
      configurationError.statusCode = 500;
      return next(configurationError);
    }

    req.user = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired authentication token' });
  }
};

module.exports = authenticate;
