const User = require('../models/user.model');

exports.getMe = async (req, res) => {
  const userId = req.user?.id || req.user?.userId;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });
  const user = await User.findById(userId).select('-passwordHash');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
};

exports.getAll = async (req, res) => {
  const users = await User.find().select('-passwordHash');
  res.json(users);
};
