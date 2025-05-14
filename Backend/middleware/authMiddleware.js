// middleware/authMiddleware.js

const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // Expect header: Authorization: “Bearer <token>”
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    // Verify and extract payload
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    // Attach to req for downstream controllers
    req.user = { id: userId };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token is not valid" });
  }
};
