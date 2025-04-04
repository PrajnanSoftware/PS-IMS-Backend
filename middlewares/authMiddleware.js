// PS-IMS-Backend-main/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

// Authentication Middleware
async function authenticateUser(req, res, next) {
    try {
        // 1) Check for Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: 'No authorization header provided.' });
        }

        // 2) Must follow format 'Bearer <token>'
        const [scheme, token] = authHeader.split(' ');
        if (scheme !== 'Bearer' || !token) {
            return res.status(401).json({ error: 'Invalid token format.' });
        }

        // 3) Verify JWT
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        // 4) Attach user data (e.g. { id, role } ) to req
        req.user = decodedToken;
        next();

    } catch (error) {
        console.error('Auth Error:', error);
        // 5) If token verification fails, return 401
        return res.status(401).json({ error: 'Authentication Failed.' });
    }
}

// Authorization Middleware
const authorizeUser = (permittedRoles) => {
    return (req, res, next) => {
        if (permittedRoles.includes(req.user?.role)) {
            next();
        } else {
            res.status(403).json({ error: 'You are not authorized to access this route.' });
        }
    };
};

module.exports = {
    authenticateUser,
    authorizeUser
};
