const jwt = require('jsonwebtoken');

// Generate access token
const generateAccessToken = (user) => {
  
  return jwt.sign(
    {
      id: user.id,      
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: '5m' }
  );
};


// Generate refresh token
const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id,
      email: user.email,
      role: user.role,
     },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  );
};

module.exports = { generateAccessToken, generateRefreshToken };


