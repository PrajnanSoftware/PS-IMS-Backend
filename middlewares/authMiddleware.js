const jwt = require('jsonwebtoken');

// Authentication Middleware
async function authenticateUser(req, res, next) {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ error: "Authentication Failed." });

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodedToken;
        next();
    } catch (error) {
        res.status(401).json({ error: "Authentication Failed." });
    }
}

// Authorization Middleware
const authorizeUser = (permittedRoles) => {
    return (req, res, next) => {
        if (permittedRoles.includes(req.user.role)) {
            next();
        } else {
            res.status(403).json({ error: 'You are not authorized to access this route' });
        }
    };
};

module.exports = {
    authenticateUser,
    authorizeUser
};
