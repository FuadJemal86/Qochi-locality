const path = require('path');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const prisma = require('../../prismaClieynt');

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        const filename = 'family_head_' + Date.now() + path.extname(file.originalname);
        cb(null, filename);
    }
});

// File size and type validation
const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
    fileFilter: (req, file, cb) => {
        // Accept images only
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    }
});

const addFamilyHead = [
    upload.single('image'),
    async (req, res) => {
        try {
            const { fullName, contactInfo, email, password, houseNumber, familysize, type } = req.body;

            // Validate required fields
            if (!fullName || !contactInfo || !email || !password || !houseNumber || !familysize || !type) {
                return res.status(400).json({
                    status: false,
                    message: 'Please fill all required fields'
                });
            }

            // Check if email already exists
            const existingFamilyHead = await prisma.familyHead.findUnique({
                where: { email }
            });

            if (existingFamilyHead) {
                return res.status(409).json({
                    status: false,
                    message: 'Email already exists'
                });
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
                    type,
                    familysize,
                    image: req.file ? req.file.filename : null
                }
            });

            // Return success response
            res.status(201).json({
                status: true,
                message: 'Family Head account created successfully',
                data: {
                    id: familyHead.id,
                    fullName: familyHead.fullName,
                    email: familyHead.email,
                    createdAt: familyHead.createdAt
                }
            });
        } catch (err) {
            console.error('Error creating Family Head account:', err);
            res.status(500).json({
                status: false,
                message: 'Internal server error'
            });
        }
    }
];

module.exports = { addFamilyHead };
