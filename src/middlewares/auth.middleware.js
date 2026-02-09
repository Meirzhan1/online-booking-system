const jwt = require("jsonwebtoken");
const { secret } = require("../config/jwt");

module.exports = function auth(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = header.split(" ")[1];

  try {
    const payload = jwt.verify(token, secret);

    req.user = {
      id: payload.id || payload.userId || payload._id || payload.sub,
      role: payload.role
    };

    if (!req.user.id) {
      return res.status(401).json({ message: "Invalid token payload (no user id)" });
    }

    next();
  } catch (e) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
