const jwt = require("jsonwebtoken");
const upload = require("../../upload");
const prisma = require("../../prismaClieynt");


const requestDeathCertificate = [
    upload.single("document"),
    async (req, res) => {
        const token = req.cookies['fh-auth-token'];
        const { id } = req.params; // Member ID

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
                dateOfBirth,
                nationality,
                placeOfDeath,
                dateOfDeath
            } = req.body;

            // Validate required fields
            if (!fullName || !dateOfBirth || !nationality || !placeOfDeath || !dateOfDeath) {
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

            // Check if a death certificate request already exists for this member
            const existingRequest = await prisma.deathCertificate.findFirst({
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
                        message: "A death certificate request for this member is already under review"
                    });
                } else if (existingRequest.status === "APPROVED") {
                    return res.status(400).json({
                        status: "approved",
                        message: "A death certificate for this member has already been approved"
                    });
                }
            }

            // Prepare data for creating death certificate request
            const deathCertificateData = {
                fullName,
                dateOfBirth: new Date(dateOfBirth),
                nationality,
                placeOfDeath,
                dateOfDeath: new Date(dateOfDeath),
                status: "PENDING",
                familyHeadId: parseInt(headId),
                memberId: parseInt(id)
            };

            // Handle document upload
            if (req.file) {
                deathCertificateData.document = req.file.filename;
            }

            // Create the death certificate request
            const newDeathCertificate = await prisma.deathCertificate.create({
                data: deathCertificateData
            });

            // Update member status to DECEASED
            await prisma.member.update({
                where: { id: parseInt(id) },
                data: { status: "DECEASED" }
            });

            res.status(201).json({
                status: "success",
                message: "Death Certificate Request submitted successfully!",
                data: newDeathCertificate
            });

        } catch (error) {
            console.error("Error requesting death certificate:", error);
            res.status(500).json({
                status: false,
                message: "Server error",
                error: error.message
            });
        }
    }
];

module.exports = { requestDeathCertificate };