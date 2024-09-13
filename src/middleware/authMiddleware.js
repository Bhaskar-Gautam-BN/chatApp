import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const token = req.headers.auth;
  if (!token) {
    return res.status(401).json({ message: "Token is not found" });
  }
  try {
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
      }
      req.user = user;
      next(); // Proceed to next middleware or route handler
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error: " + error.message });
  }
};

export default authMiddleware;
