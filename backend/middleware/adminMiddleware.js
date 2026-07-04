const User = require('../models/User');

const adminMiddleware = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      success: false, 
      message: 'Authentication required' 
    });
  }

  try {
    // Verify current role from DB (JWT payload could be stale)
    const user = await User.findById(req.user.id).select('role isBanned').lean();

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.isBanned) {
      return res.status(403).json({
        success: false,
        message: 'Account suspended'
      });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Admin access required' 
      });
    }

    next();
  } catch (error) {
    console.error('Admin middleware error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Authorization check failed'
    });
  }
};

module.exports = adminMiddleware;
