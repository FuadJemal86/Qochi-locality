const prisma = require('../../prismaClieynt');
const upload = require('../../upload');

const uploadMarriageCertification = [
    upload.fields([{ name: "document", maxCount: 1 }]),
    async (req, res) => {
        try {
            const { id } = req.body;

            if (!id) {
                return res.status(400).json({ status: false, message: "member ID is required" });
            }

            if (!req.files || !req.files.document || req.files.document.length === 0) {
                return res.status(400).json({ status: false, message: "No document uploaded" });
            }

            const member = await prisma.member.findUnique({
                where: { id: parseInt(id) },
                select: { headId: true }
            });

            if (!member || !member.headId) {
                return res.status(404).json({ status: false, message: "Member or associated family head not found" });
            }

            const documentFile = req.files.document[0];
            const documentPath = documentFile.filename;

            await prisma.certiAndId.create({
                data: {
                    memberId: parseInt(id),
                    familyHeadId: member.headId,
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

module.exports = uploadMarriageCertification;
