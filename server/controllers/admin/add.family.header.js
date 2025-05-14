const path = require('path');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const prisma = require('../../prismaClieynt');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        const filename = 'family_head_' + Date.now() + path.extname(file.originalname);
        cb(null, filename);
    }
});

const upload = multer({ storage: storage });

const addFamilyHead = [upload.single('image'), async (req, res) => {
    try {
        const { fullName, contactInfo, email, password, houseNumber, familysize } = req.body;

        if (!fullName || !contactInfo || !email || !password || !houseNumber || !familysize) {
            return res.status(400).json({ status: false, message: 'Please fill all required fields' });
        }

        const existingFamilyHead = await prisma.familyHead.findUnique({ where: { email } });
        if (existingFamilyHead) {
            return res.status(409).json({ status: false, message: 'Email already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save Family Head to database
        const familyHead = await prisma.familyHead.create({
            data: {
                fullName,
                contactInfo,
                email,
                password: hashedPassword,
                houseNumber,
                familysize,
                image: req.file ? req.file.filename : null
            }
        });

        res.status(201).json({ status: true, message: 'Family Head account created successfully', data: familyHead });
    } catch (err) {
        console.error('Error creating Family Head account:', err.message);
        res.status(500).json({ status: false, message: 'Internal server error' });
    }
}];

module.exports = { addFamilyHead };
