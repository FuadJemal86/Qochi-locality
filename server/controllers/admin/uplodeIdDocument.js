const prisma = require('../../prismaClieynt');
const upload = require('../../upload');

const uploadIdDocument = [
    upload.fields([{ name: "document", maxCount: 1 }]),
    async (req, res) => {
        try {
            const { headId } = req.body;

            if (!headId) {
                return res.status(400).json({ status: false, message: "headId ID is required" });
            }

            if (!req.files || !req.files.document || req.files.document.length === 0) {
                return res.status(400).json({ status: false, message: "No document uploaded" });
            }

            const documentFile = req.files.document[0];
            const documentPath = documentFile.filename;



            await prisma.certiAndId.create({
                data: {
                    familyHeadId: parseInt(headId),
                    document: documentPath
                }
            });

            return res.status(200).json({ status: true, message: "Document uploaded successfully" });

        } catch (error) {
            console.error("Upload error:", error);
            return res.status(500).json({ status: false, message: "Server error while uploading document" });
        }
    }
];

module.exports = uploadIdDocument;
