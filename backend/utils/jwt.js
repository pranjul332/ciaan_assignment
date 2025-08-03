const jwt = require("jsonwebtoken");

function generateToken(user) {
  const secretKey = process.env.JWT_SECRET || "your_default_secret_key";
  return jwt.sign({ id: user._id }, secretKey, { expiresIn: "1h" });
}

function verifyToken(req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1];
  // const secretKey = process.env.JWT_SECRET || 'your_default_secret_key';

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied, no token provided" });
  }

  try {
    const decoded = jwt.verify(token, "your_secret_key");
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).json({ message: "Invalid token" });
  }
}

module.exports = { generateToken, verifyToken };
