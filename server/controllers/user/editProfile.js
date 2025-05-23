const express = require('express');
const prisma = require('../../prismaClieynt');
const upload = require('../../upload');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const editHeaderProfile = [
    upload.single('image'),
    async (req, res) => {
        const token = req.cookies['fh-auth-token'];

        if (!token) {
            return res.status(400).json({ status: false, message: 'No token provided' });
        }

        try {
            const decoded = jwt.verify(token, process.env.USER_KEY);
            const id = decoded.id;

            const { name, email, password } = req.body;

            const existingUser = await prisma.familyHead.findFirst({
                where: {
                    email: email,
                    NOT: {
                        id: Number(id),
                    },
                },
            });

            if (existingUser) {
                return res.status(400).json({ status: false, message: 'Email already in use by another user' });
            }

            let image;
            let hashedPassword;

            if (req.file) {
                image = req.file.filename;
            }

            if (password && password.trim() !== '') {
                const salt = await bcrypt.genSalt(10);
                hashedPassword = await bcrypt.hash(password, salt);
            }

            const updateData = {
                fullName: name,
                email,
                ...(image && { image }),
                ...(hashedPassword && { password: hashedPassword }),
            };

            const updatedUser = await prisma.familyHead.update({
                where: { id: Number(id) },
                data: updateData,
            });

            return res.status(200).json({
                status: true,
                message: 'Profile updated successfully',
                user: updatedUser,
            });
        } catch (error) {
            console.error('Profile update error:', error);
            return res.status(500).json({
                status: false,
                message: 'Server error while updating profile',
            });
        }
    },
];

module.exports = { editHeaderProfile };
