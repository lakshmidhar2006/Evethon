import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies?.accessToken;
  if (!token) return res.status(401).json({ message: "No token cookie" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decoded.id,
      email: decoded.email,
      organizerEnabled: decoded.organizerEnabled,
      isAdmin: decoded.isAdmin
    };
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  next();
};

export const authorizeOrganizer = (req, res, next) => {
  if (!req.user.organizerEnabled) {
    return res.status(403).json({ message: "Forbidden: Organizer capability required" });
  }
  next();
};

export const authorizeAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: "Forbidden: Admin access required" });
  }
  next();
};

// Legacy support (bridge for existing role checks if any remain)
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    const hasAdmin = roles.includes('admin') && req.user.isAdmin;
    const hasOrganizer = roles.includes('organizer') && req.user.organizerEnabled;

    if (hasAdmin || hasOrganizer) {
      return next();
    }

    // If role is strictly 'student' and nothing else is required, we might allow it?
    // But currently verifyToken doesn't provide role. Assuming auth users are students.
    if (roles.includes('student')) {
      return next();
    }

    return res.status(403).json({ message: "Forbidden: Insufficient permissions" });
  };
};

export const verifyAdminBootstrapKey = (req, res, next) => {
  const key = req.headers["x-admin-key"];
  if (!key || key !== process.env.ADMIN_BOOTSTRAP_KEY)
    return res.status(401).json({ message: "Invalid admin bootstrap key" });
  next();
};
