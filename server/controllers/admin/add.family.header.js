const path = require('path');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const prisma = require('../../prismaClieynt');

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        const filename = 'family_head_' + Date.now() + path.extname(file.originalname);
        cb(null, filename);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    }
});

// Email sender config
const transporter = nodemailer.createTransport({
    service: 'gmail', // or use 'hotmail', 'yahoo', or your SMTP settings
    auth: {
        user: 'fuad47722@gmail.com', // replace with your email
        pass: 'nocl yrmb nnrl cxxk'     // replace with your email's app password
    }
});

const addFamilyHead = [
    upload.single('image'),
    async (req, res) => {
        try {
            const { fullName, contactInfo, email, password, houseNumber, familysize, type } = req.body;

            if (!fullName || !contactInfo || !email || !password || !houseNumber || !familysize || !type) {
                return res.status(400).json({
                    status: false,
                    message: 'Please fill all required fields'
                });
            }

            const existingFamilyHead = await prisma.familyHead.findUnique({
                where: { email }
            });

            if (existingFamilyHead) {
                return res.status(409).json({
                    status: false,
                    message: 'Email already exists'
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

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

            // ✅ Send the password via email
            const mailOptions = {
                from: 'fuad47722@gmail.com',
                to: email,
                subject: 'Your Family Head Account Details',
                text: `Dear ${fullName},\n\nYour account has been successfully created.\n\nEmail: ${email}\nPassword: ${password}\n\nPlease keep this information secure.\n\nThank you.`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Failed to send email:', error);
                } else {
                    console.log('Email sent:', info.response);
                }
            });

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
