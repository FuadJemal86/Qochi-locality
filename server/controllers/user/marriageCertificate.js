const jwt = require("jsonwebtoken");
const upload = require("../../upload");
const prisma = require("../../prismaClieynt");

// Marriage Certificate Request Controller
const requestMarriageCertificate = [
    upload.single("document"), // For uploading supporting document
    async (req, res) => {
        try {
            const token = req.cookies['fh-auth-token'];
            if (!token) {
                return res.status(400).json({
                    status: "error",
                    message: 'No token provided'
                });
            }

            const decoded = jwt.verify(token, process.env.USER_KEY);
            const familyHeadId = decoded?.id;

            if (!familyHeadId) {
                return res.status(400).json({
                    status: "error",
                    message: 'Invalid authentication token'
                });
            }

            const {
                wifeFullName,
                wifeId,

                husbandFullName,
                husbandId,

                dateOfMarriage,

                placeOfMarriage,
                country,
                region,
                cityAdministration,
                zone,
                city,
                subCity,
                woreda,
            } = req.body;

            if (!wifeFullName || !wifeId || !husbandFullName || !husbandId || !dateOfMarriage ||
                !placeOfMarriage || !country || !region || !zone || !woreda) {
                return res.status(400).json({
                    status: "error",
                    message: 'Please fill all required fields'
                });
            }

            // Prepare certificate data
            const certificateData = {
                wifeFullName,
                wifeId,
                husbandFullName,
                husbandId,
                dateOfMarriage: new Date(dateOfMarriage),
                placeOfMarriage,
                country,
                region,
                cityAdministration: cityAdministration || "",
                zone,
                city: city || "",
                subCity: subCity || "",
                woreda,
                familyHeadId: parseInt(familyHeadId),
                status: "PENDING" // Default status
            };

            if (req.file) {
                certificateData.document = req.file.filename;
            }

            // Check if both wifeId and husbandId correspond to members 
            // This is optional and can link the certificate to actual members if they exist
            const wifeMember = await prisma.member.findFirst({
                where: {
                    headId: parseInt(familyHeadId),
                    fullName: wifeFullName
                }
            });

            const husbandMember = await prisma.member.findFirst({
                where: {
                    headId: parseInt(familyHeadId),
                    fullName: husbandFullName
                }
            });

            if (wifeMember) {
                certificateData.wifeMemberId = wifeMember.id;
            }

            if (husbandMember) {
                certificateData.husbandMemberId = husbandMember.id;
            }

            // Save the marriage certificate request to the database
            const newCertificate = await prisma.marriageCertificate.create({
                data: certificateData
            });

            // Return success response
            return res.status(201).json({
                status: "success",
                message: "Marriage Certificate Request submitted successfully!",
                data: newCertificate
            });

        } catch (error) {
            console.error("Error in marriage certificate request:", error);

            // Handle specific JWT error
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({
                    status: "error",
                    message: "Invalid authentication token"
                });
            }

            // Handle general server error
            return res.status(500).json({
                status: "error",
                message: "Server error",
                error: error.message
            });
        }
    }
];


module.exports = { requestMarriageCertificate };