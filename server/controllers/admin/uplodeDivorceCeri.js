const prisma = require('../../prismaClieynt');
const upload = require('../../upload');

const uploadDivorceCertification = [
    upload.fields([{ name: "document", maxCount: 1 }]),
    async (req, res) => {
        try {
            const { id } = req.body; // memberId

            if (!id) {
                return res.status(400).json({ status: false, message: "Member ID is required" });
            }

            if (!req.files || !req.files.document || req.files.document.length === 0) {
                return res.status(400).json({ status: false, message: "No document uploaded" });
            }

            // Look up the familyHeadId using the member's id
            const member = await prisma.member.findUnique({
                where: { id: parseInt(id) },
                select: { headId: true }
            });

            if (!member || !member.headId) {
                return res.status(404).json({ status: false, message: "Member or associated family head not found" });
            }

            const documentFile = req.files.document[0];
            const documentPath = documentFile.filename;

            // Store document with familyHeadId and optionally memberId
            await prisma.certiAndId.create({
                data: {
                    familyHeadId: member.headId,
                    memberId: parseInt(id),
                    document: documentPath
                }
            });

            return res.status(200).json({ status: true, message: "Divorce certificate uploaded successfully" });

        } catch (error) {
            console.error("Upload error:", error);
            return res.status(500).json({ status: false, message: "Server error while uploading document" });
        }
    }
];

module.exports = uploadDivorceCertification;
