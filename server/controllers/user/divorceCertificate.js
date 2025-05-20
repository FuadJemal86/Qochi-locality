const jwt = require("jsonwebtoken");
const upload = require("../../upload");
const prisma = require("../../prismaClieynt");

const requestDivorceCertificate = [
    upload.fields([
        { name: "document", maxCount: 1 }
    ]),

    async (req, res) => {
        const { id } = req.params; // Member ID

        const token = req.cookies['fh-auth-token'];
        if (!token) {
            return res.status(400).json({
                status: "error",
                message: 'No token provided. Authentication required.'
            });
        }

        let headId;

        try {
            const decoded = jwt.verify(token, process.env.USER_KEY);
            headId = decoded?.id;

        } catch (err) {
            console.log(err);
            return res.status(401).json({ status: false, message: 'un authorize token provide' });
        }

        try {
            const existingRequest = await prisma.divorceCertificate.findFirst({
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
                        message: "A divorce certificate request for this member is already under review"
                    });
                } else if (existingRequest.status === "APPROVED") {
                    return res.status(400).json({
                        status: "approved",
                        message: "A divorce certificate for this member has already been approved"
                    });
                }
            }

            const {
                firstSpouseFullName,
                firstSpouseBirthDate,
                firstSpouseNationality,
                firstSpousePlaceOfBirth,

                secondSpouseFullName,
                secondSpouseBirthDate,
                secondSpouseNationality,
                secondSpousePlaceOfBirth,

                dateOfDivorce,
                countryAuthority,
                caseNumber,
                placeOfDivorce,

                status
            } = req.body;

            if (!firstSpouseFullName || !firstSpouseBirthDate || !secondSpouseFullName ||
                !secondSpouseBirthDate || !dateOfDivorce || !countryAuthority || !caseNumber || !placeOfDivorce) {
                return res.status(400).json({
                    status: "error",
                    message: "Please complete all required fields"
                });
            }

            const divorceData = {
                firstSpouseFullName,
                firstSpouseBirthDate: new Date(firstSpouseBirthDate),
                firstSpouseNationality,
                firstSpousePlaceOfBirth,

                secondSpouseFullName,
                secondSpouseBirthDate: new Date(secondSpouseBirthDate),
                secondSpouseNationality,
                secondSpousePlaceOfBirth,

                dateOfDivorce: new Date(dateOfDivorce),
                countryAuthority,
                caseNumber,
                placeOfDivorce,

                documentFile: req.files && req.files.document && req.files.document.length > 0
                    ? req.files.document[0].filename
                    : null,
                familyHeadId: parseInt(headId),  // Changed from familyHeaderId to familyHeadId
                memberId: parseInt(id),
                status: status || "PENDING"
            };

            const newDivorceCertificate = await prisma.divorceCertificate.create({
                data: divorceData
            });

            let responseStatus = "success";
            let responseMessage = "Divorce Certificate Request submitted successfully!";

            if (newDivorceCertificate.status === "PENDING") {
                responseStatus = "PENDING";
                responseMessage = "Your request has been received and is under review.";
            } else if (newDivorceCertificate.status === "APPROVED") {
                responseStatus = "approved";
                responseMessage = "Your request has been approved.";
            }

            // Send success response
            return res.status(201).json({
                status: responseStatus,
                message: responseMessage,
                data: newDivorceCertificate
            });

        } catch (error) {
            console.error("Error requesting divorce certificate:", error);
            return res.status(500).json({
                status: "error",
                message: "Server error occurred while processing your request",
                error: error.message
            });
        }
    }
];

module.exports = { requestDivorceCertificate };