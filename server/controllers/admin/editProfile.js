const express = require('express');
const router = express.Router();
const prisma = require('../../prismaClieynt');
const upload = require('../../upload');
const bcrypt = require('bcryptjs');

const editHeaderProfile = [upload.single('image'), async (req, res) => {
    try {
        const id = req.cookies['fh-auth-token']

        const { name, email, password } = req.body;
        let image;
        let hashedPassword;

        if (req.file) {
            image = req.file.filename;
        }

        if (password && password.trim() !== '') {
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(password, salt);
        }

        // Build update data dynamically
        const updateData = {
            fullName: name,
            email,
            ...(image && { image }),
            ...(hashedPassword && { password: hashedPassword }),
        };

        const updatedAdmin = await prisma.familyHead.update({
            where: { id: Number(id) },
            data: updateData
        });

        return res.status(200).json({
            status: true,
            message: "Profile updated successfully",
            admin: updatedAdmin
        });

    } catch (error) {
        console.error("Profile update error:", error);
        return res.status(500).json({
            status: false,
            message: "Server error while updating profile"
        });
    }
}];

module.exports = { editHeaderProfile }
