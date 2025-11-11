import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies?.accessToken;
  if (!token) return res.status(401).json({ message: "No token cookie" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email, role }
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const authorizeRoles = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role))
    return res.status(403).json({ message: "Forbidden: insufficient role" });
  next();
};

export const verifyAdminBootstrapKey = (req, res, next) => {
  const key = req.headers["x-admin-key"];
  if (!key || key !== process.env.ADMIN_BOOTSTRAP_KEY)
    return res.status(401).json({ message: "Invalid admin bootstrap key" });
  next();
};
