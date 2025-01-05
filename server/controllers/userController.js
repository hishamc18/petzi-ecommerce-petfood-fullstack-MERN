const asyncHandler = require('../middlewares/asyncHandler');
const { registerUserService, loginUserService, logoutUserService, getUserDetails } = require('../services/userService');
const { registerValidation, loginValidation } = require('../utils/validators');
const { generateAccessToken } = require('../utils/generateToken')
const CustomError = require('../utils/customError');
const jwt = require('jsonwebtoken')

// Register User
exports.registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  const { error } = registerValidation.validate({ username, email, password, confirmPassword });
  if (error) throw new CustomError(error.details[0].message, 400);
  const user = await registerUserService({ username, email, password });

  // Send response
  res.status(201).json({
    message: 'User registered successfully',
    user,
  });
});

// Login User
exports.loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const { error } = loginValidation.validate({ email, password });
  if (error) throw new CustomError(error.details[0].message, 400);

  const { accessToken, refreshToken, user } = await loginUserService({ email, password });

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: true,
    maxAge: 5 * 60 * 1000, // 5 minutese
    path: '/',
    sameSite: 'none'
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
    sameSite: 'none'
  });
  res.status(200).json({
    message: 'Login successful',
    user,
  });
});


// Refresh Token
exports.refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    throw new CustomError('Refresh token not found', 401);
  }

  try {
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);   

    const newAccessToken = generateAccessToken({ id: decoded.id, role: decoded.role, email: decoded.email});

    // Set the new access token as a cookie
    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 5 * 60 * 1000,
    });

    res.status(200).json({ message: 'Token refreshed successfully' });
  } catch (err) {
    throw new CustomError('Invalid or expired refresh token', 401);
  }
});


// Logout User
exports.logoutUser = asyncHandler(async (req, res) => {
    await logoutUserService();

    res.clearCookie('accessToken', {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: '/'
    });
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: '/'
    });

    res.status(200).json({ message: 'Logged out successfully' });
});


exports.getLoggedInUser = asyncHandler(async(req, res) => {
  const user = await getUserDetails(req.user.id);  
  if (!user) {
    throw new CustomError('User not found', 404);
  }
  res.status(200).json({ user });
});



