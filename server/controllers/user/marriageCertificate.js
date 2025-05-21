const jwt = require("jsonwebtoken");
const upload = require("../../upload");
const prisma = require("../../prismaClieynt");

const requestMarriageCertificate = [
    upload.single("document"),
    async (req, res) => {
        const token = req.cookies['fh-auth-token'];
        const { id } = req.params; // Member ID

        if (!token) {
            return res.status(400).json({
                status: false,
                message: 'No token provided'
            });
        }

        let headId;
        try {
            const decoded = jwt.verify(token, process.env.USER_KEY);
            headId = decoded?.id;

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
                woreda
            } = req.body;

            // Validate required fields
            if (!wifeFullName || !wifeId || !husbandFullName || !husbandId || !dateOfMarriage ||
                !placeOfMarriage || !country || !region || !zone || !woreda) {
                return res.status(400).json({
                    status: false,
                    message: 'Please fill all required fields'
                });
            }

            // Check if the member belongs to the head
            const member = await prisma.member.findFirst({
                where: {
                    id: parseInt(id),
                    headId: parseInt(headId)
                }
            });

            // If the member is not found, proceed without setting memberId
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
                familyHeadId: parseInt(headId),
                status: "PENDING"
            };

            if (member) {
                certificateData.memberId = member.id;
            }

            // Attach uploaded document if available
            if (req.file) {
                certificateData.document = req.file.filename;
            }

            const newCertificate = await prisma.marriageCertificate.create({
                data: certificateData
            });

            return res.status(201).json({
                status: "success",
                message: "Marriage Certificate Request submitted successfully!",
                data: newCertificate
            });

        } catch (error) {
            console.error("Error in marriage certificate request:", error);

            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({
                    status: "error",
                    message: "Invalid authentication token"
                });
            }

            return res.status(500).json({
                status: "error",
                message: "Server error",
                error: error.message
            });
        }
    }
];

module.exports = { requestMarriageCertificate };
