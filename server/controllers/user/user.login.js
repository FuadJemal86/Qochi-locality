const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../../prismaClieynt');

const user = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ loginStatus: false, message: 'Please fill all fields!' });
    }

    try {
        const familyHead = await prisma.familyHead.findUnique({ where: { email, isRemoved: false } });

        if (!familyHead) {
            return res.status(401).json({ loginStatus: false, message: 'Wrong Email or Password' });
        }

        const isPasswordValid = await bcrypt.compare(password, familyHead.password);

        if (!isPasswordValid) {
            return res.status(401).json({ loginStatus: false, message: 'Wrong Email or Password' });
        }

        const token = jwt.sign(
            { role: 'family-head', email: familyHead.email, id: familyHead.id },
            process.env.USER_KEY,
            { expiresIn: '30d' }
        );

        res.cookie("fh-auth-token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: "lax",
        });

        res.status(200).json({ loginStatus: true, message: "Login successful" });
    } catch (err) {
        console.error("Login error:", err.message);
        res.status(500).json({ loginStatus: false, error: err.message });
    }
};

module.exports = { user };
