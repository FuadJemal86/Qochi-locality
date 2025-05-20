const jwt = require("jsonwebtoken");
const upload = require("../../upload");
const prisma = require("../../prismaClieynt");


// Request Birth Certificate Controller
const requestBirthCertificate = [
    upload.single("document"),
    async (req, res) => {
        const token = req.cookies['fh-auth-token'];
        const { id } = req.params;

        if (!token) {
            return res.status(400).json({ status: false, message: 'no token provided' });
        }

        let headId;
        try {
            // Decode the token
            const decoded = jwt.verify(token, process.env.USER_KEY);
            headId = decoded?.id;

            const {
                fullName,
                gender,
                dateOfBirth,
                placeOfBirth,
                nationality,
                country,
                region,
                zone,
                woreda,
                fatherFullName,
                fatherNationality,
                fatherId,
                motherFullName,
                motherNationality,
                motherId
            } = req.body;

            // Validate required fields
            if (!fullName || !dateOfBirth || !nationality || !fatherFullName || !motherFullName) {
                return res.status(400).json({
                    status: false,
                    message: 'Please fill all required fields'
                });
            }

            // Check if member exists and belongs to the family head
            const member = await prisma.member.findFirst({
                where: {
                    id: parseInt(id),
                    headId: parseInt(headId)
                }
            });

            if (!member) {
                return res.status(404).json({
                    status: false,
                    message: "Member not found or you don't have access to this member"
                });
            }

            // Check if a birth certificate request already exists for this member
            const existingRequest = await prisma.birthCertificate.findFirst({
                where: {
                    memberId: parseInt(id),
                    status: { in: ['PENDING', 'APPROVED'] }
                }
            });

            // Handle existing requests
            if (existingRequest) {
                if (existingRequest.status === "PENDING") {
                    return res.status(400).json({
                        status: "review",
                        message: "A birth certificate request for this member is already under review"
                    });
                } else if (existingRequest.status === "APPROVED") {
                    return res.status(400).json({
                        status: "approved",
                        message: "A birth certificate for this member has already been approved"
                    });
                }
            }

            // Prepare data for creating birth certificate request
            const birthCertificateData = {
                fullName,
                gender,
                dateOfBirth: new Date(dateOfBirth),
                placeOfBirth,
                nationality,
                country,
                region,
                zone,
                woreda,
                fatherFullName,
                fatherNationality,
                fatherId,
                motherFullName,
                motherNationality,
                motherId,
                status: "PENDING",
                familyHeadId: parseInt(headId),
                memberId: parseInt(id)
            };

            // Handle document upload
            if (req.file) {
                birthCertificateData.document = req.file.filename;
            }

            // Create the birth certificate request
            const newBirthCertificate = await prisma.birthCertificate.create({
                data: birthCertificateData
            });

            res.status(201).json({
                status: "success",
                message: "Birth Certificate Request submitted successfully!",
                data: newBirthCertificate
            });

        } catch (error) {
            console.error("Error requesting birth certificate:", error);
            res.status(500).json({
                status: false,
                message: "Server error",
                error: error.message
            });
        }
    }
];

module.exports = { requestBirthCertificate };