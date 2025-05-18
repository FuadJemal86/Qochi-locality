const prisma = require("../../prismaClieynt");
const upload = require("../../upload");
const jwt = require("jsonwebtoken");

const idRequest = [
    upload.fields([
        { name: "image", maxCount: 1 },
        { name: "gotImage", maxCount: 1 }
    ]),
    async (req, res) => {
        const memberId = req.params.id;
        const token = req.cookies["fh-auth-token"];

        if (!token) {
            return res.status(400).json({ status: false, message: "No token provided" });
        }

        const decoded = jwt.verify(token, process.env.USER_KEY);
        const familyHeadId = decoded.id;

        try {
            const {
                fullName, mothersName, age, gender, occupation,
                phoneNumber, placeOFBirth, address, houseNumber,
                Nationality, emergencyContact, type
            } = req.body;

            const imageFile = req.files.image ? req.files.image[0].filename : null;
            const gotImageFile = req.files.gotImage ? req.files.gotImage[0].filename : null;

            // Check if there is already a request for this member
            const existingRequest = await prisma.iDRequest.findFirst({
                where: {
                    memberId: parseInt(memberId),
                    familyHeadId: parseInt(familyHeadId)
                },
                orderBy: { createdAt: "desc" }
            });

            // Handle different status cases
            if (existingRequest) {
                const { status } = existingRequest;

                // If status is PENDING
                if (status === "PENDING") {
                    return res.status(400).json({
                        status: false,
                        message: "The data is under review."
                    });
                }

                // If status is APPROVED
                if (status === "APPROVED") {
                    return res.status(400).json({
                        status: false,
                        message: "The data is already approved."
                    });
                }

                // If status is REJECTED or EXPIRED
                if (status === "REJECTED" || status === "EXPIRED") {
                    const updatedRequest = await prisma.iDRequest.update({
                        where: { id: existingRequest.id },
                        data: {
                            fullName,
                            mothersName,
                            age: parseInt(age),
                            gender,
                            occupation,
                            phoneNumber,
                            placeOFBirth,
                            address,
                            houseNumber,
                            Nationality,
                            emergencyContact,
                            image: imageFile || existingRequest.image,
                            gotImage: gotImageFile || existingRequest.gotImage,
                            type,
                            status: "PENDING"
                        }
                    });

                    return res.json({
                        status: "success",
                        message: "ID Request updated successfully!",
                        data: updatedRequest
                    });
                }
            }

            // Create a new ID request if no previous request exists
            const newRequest = await prisma.iDRequest.create({
                data: {
                    fullName,
                    mothersName,
                    age: parseInt(age),
                    gender,
                    occupation,
                    phoneNumber,
                    placeOFBirth,
                    address,
                    houseNumber,
                    Nationality,
                    emergencyContact,
                    image: imageFile,
                    gotImage: gotImageFile,
                    type,
                    status: "PENDING",
                    familyHeadId: parseInt(familyHeadId),
                    memberId: parseInt(memberId)
                }
            });

            res.json({ status: "success", message: "ID Request submitted successfully!", data: newRequest });
        } catch (error) {
            console.error(error);
            res.status(500).json({ status: "error", message: "Failed to create or update ID request" });
        }
    }
];

module.exports = { idRequest };
