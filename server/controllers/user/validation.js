const jwt = require('jsonwebtoken')


const validation = async (req, res) => {

    const token = req.cookies['fh-auth-token'];


    if (!token) {
        return res.status(400).json({ message: 'Token is required' });
    }

    try {
        jwt.verify(token, process.env.USER_KEY);
        return res.json({ valid: true });
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
}

module.exports = { validation }