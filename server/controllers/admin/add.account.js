
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const prisma = require('../../prismaClieynt');
const upload = require('../../upload');


// Add Admin Account
const addAccount = [upload.single('image'), async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    try {
        const existingAdmin = await prisma.admin.findUnique({ where: { email } });
        if (existingAdmin) {
            return res.status(409).json({ success: false, message: 'Admin with this email already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = await prisma.admin.create({
            data: {
                name,
                email,
                password: hashedPassword,
                image: req.file ? req.file.filename : null,
            },
        });

        const token = jwt.sign(
            { admin: true, email: newAdmin.email, id: newAdmin.id },
            process.env.ADMIN_KEY,
            { expiresIn: '30d' }
        );

        // Set the JWT token as a cookie
        res.cookie('admin-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: 'lax',
        });

        res.status(201).json({ status: true, message: 'Admin account created successfully' });
    } catch (err) {
        console.error('Error creating admin account:', err.message);
        res.status(500).json({ status: false, message: 'Internal server error', error: err.message });
    }
}];

module.exports = { addAccount };
