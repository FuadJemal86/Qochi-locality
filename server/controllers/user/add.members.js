const jwt = require("jsonwebtoken");
const upload = require("../../upload");
const prisma = require("../../prismaClieynt");

// Add Member Controller
const addMember = [
    upload.fields([
        { name: "birthCertificate", maxCount: 1 },
        { name: "image", maxCount: 1 },
        { name: "deathCertificate", maxCount: 1 },
        { name: "marriageCertificate", maxCount: 1 }
    ]),
    async (req, res) => {
        const token = req.cookies['fh-auth-token'];

        if (!token) {
            return res.status(400).json({ status: false, message: 'no token provided' });
        }

        try {
            // Decode the token
            const decoded = jwt.verify(token, process.env.USER_KEY);
            const headId = decoded.id;

            const {
                fullName,
                birthDate,
                type,
                relationship,
                education,
                occupation,
                status,
                idExpiryDate
            } = req.body;

            if (!fullName || !birthDate || !relationship) {
                return res.status(400).json({ status: false, message: 'please fill the input field' })
            }

            // Log files received for debugging

            const memberData = {
                fullName,
                birthDate: new Date(birthDate),
                type,
                relationship,
                education,
                occupation,
                status,
                idExpiryDate: idExpiryDate ? new Date(idExpiryDate) : null,
                headId: parseInt(headId),
            };

            // Handle file uploads - fix path handling
            if (req.files) {
                if (req.files.birthCertificate && req.files.birthCertificate.length > 0) {
                    memberData.birthCertificate = req.files.birthCertificate[0].filename;
                }
                if (req.files.image && req.files.image.length > 0) {
                    memberData.image = req.files.image[0].filename;
                }
                if (req.files.deathCertificate && req.files.deathCertificate.length > 0) {
                    memberData.deathCertificate = req.files.deathCertificate[0].filename;
                }
                if (req.files.marriageCertificate && req.files.marriageCertificate.length > 0) {
                    memberData.marriageCertificate = req.files.marriageCertificate[0].filename;
                }
            }


            // Save the member
            const newMember = await prisma.member.create({ data: memberData });

            res.status(201).json({
                status: true,
                message: "Member added successfully",
                member: newMember,
            });

        } catch (error) {
            console.error("Error adding member:", error);
            res.status(500).json({ status: false, message: "Server error", error: error.message });
        }
    }
];

module.exports = { addMember };