const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../config/jwt');

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ error: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, phone });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshTokens.push({ token: refreshToken, expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) });
    await user.save();

    res.status(201).json({
      accessToken,
      refreshToken,
      user: { id: user._id, name: user.name, email: user.email, preferences: user.preferences }
    });
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshTokens.push({ token: refreshToken, expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) });
    user.lastLogin = new Date();
    await user.save();

    res.json({
      accessToken,
      refreshToken,
      user: { id: user._id, name: user.name, email: user.email, preferences: user.preferences }
    });
  } catch (err) { next(err); }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ error: 'No refresh token' });

    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.userId);
    if (!user || !user.refreshTokens.some(t => t.token === refreshToken)) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    const newAccessToken = generateAccessToken(user._id);
    res.json({ accessToken: newAccessToken });
  } catch (err) { next(err); }
};

exports.logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    await User.findByIdAndUpdate(req.userId, {
      $pull: { refreshTokens: { token: refreshToken } }
    });
    res.json({ message: 'Logged out successfully' });
  } catch (err) { next(err); }
};

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select('-password -refreshTokens');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) { next(err); }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone, monthlyIncome, preferences } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { name, phone, monthlyIncome, preferences },
      { new: true, runValidators: true }
    ).select('-password -refreshTokens');
    res.json(user);
  } catch (err) { next(err); }
};
