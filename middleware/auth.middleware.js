
import jwt from "jsonwebtoken";


const authMiddleware = (req, res, next) => {
  try {
    // Get the token from the Authorization header
    const authHeader = req.header('Authorization');
  console.log("authHeader: ",authHeader);
    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header missing' });
    }

    const token = authHeader.replace('Bearer ', '');

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the decoded object contains the expected properties
    if (!decoded || !decoded.userId) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Add the user ID from the token to the request object
    req.userId = decoded.userId;
 console.log("userId: ",req.userId)
    // Call next to continue to the next middleware
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed' });
  }
};


export default authMiddleware;