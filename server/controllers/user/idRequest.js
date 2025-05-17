const prisma = require("../../prismaClieynt");
const upload = require("../../upload");
const jwt = require("jsonwebtoken");

const idRequest = [
    upload.fields([{ name: "image", maxCount: 1 }]),
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

            // Check if there is already a request for this member
            const existingRequest = await prisma.iDRequest.findFirst({
                where: {
                    memberId: parseInt(memberId),
                    familyHeadId: parseInt(familyHeadId)
                },
                orderBy: { createdAt: "desc" }
            });

            if (existingRequest) {
                if (existingRequest.status === "PENDING") {
                    return res.status(400).json({
                        status: false,
                        message: "The data is under review."
                    });
                } else if (existingRequest.status === "APPROVED") {
                    return res.status(400).json({
                        status: false,
                        message: "The data is already approved."
                    });
                } else if (existingRequest.status === "REJECTED") {
                    // Update the existing rejected request
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
                            type,
                            status: "PENDING"
                        }
                    });

                    return res.json({ status: "success", data: updatedRequest });
                }
            }

            if (status === "REJECTED" || (status === "EXPIRED" && new Date(idExpiryDate) <= new Date())) {
                // Update the existing rejected or expired request
                const updatedRequest = await prisma.iDRequest.update({
                    where: { id: existingRequest.id },
                    data: {
                        fullName,
                        mothersName,
                        age: parsedAge,
                        gender,
                        occupation,
                        phoneNumber,
                        placeOFBirth,
                        address,
                        houseNumber,
                        Nationality,
                        emergencyContact,
                        image: imageFile || existingRequest.image,
                        type,
                        status: "PENDING",
                        idExpiryDate: null, // Reset expiry date on update
                        idRestored: false,
                        restorationDate: null,
                        restorationPayment: null
                    }
                });

                return res.json({ status: "success", data: updatedRequest });
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
                    type,
                    status: "PENDING",
                    familyHeadId: parseInt(familyHeadId),
                    memberId: parseInt(memberId)
                }
            });

            res.json({ status: "success", data: newRequest });
        } catch (error) {
            console.error(error);
            res.status(500).json({ status: "error", message: "Failed to create or update ID request" });
        }
    }
];

module.exports = { idRequest };
