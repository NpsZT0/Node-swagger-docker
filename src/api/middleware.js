const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    const token = req.header('Auth');
    console.log("Token:", token);
    if (!token) return res.status(401).json({ error: 'Access denied' });
    try {
        const decoded = jwt.verify(token, process.env.AUTH_JWT);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = verifyToken;