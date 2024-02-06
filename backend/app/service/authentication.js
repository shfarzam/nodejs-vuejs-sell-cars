const jwt = require('jsonwebtoken');

// Middleware function for token authentication
const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized - Missing token' });
    }

    jwt.verify(token, 'sell_car_secret_key', (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden - Invalid token' });
        }
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;
