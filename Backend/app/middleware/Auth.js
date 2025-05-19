import { verifyToken } from "../../jwt.js";

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = verifyToken(token);

    if (decodedToken.tokenExp) {
      return res.status(401).json({
        error: "Token Expire.",
      });
    }
    req.user = decodedToken.decode;
    next();
  } catch {
    return res.status(401).json({
      error: "Invalid Request.",
    });
  }
};

export default authMiddleware;

