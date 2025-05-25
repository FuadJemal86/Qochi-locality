const prisma = require("../../prismaClieynt");

const editMember = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            fullName,
            birthDate,
            type,
            relationship,
            education,
            occupation,
            status,
            memberType,
            whoMember
        } = req.body;

        const updatedMember = await prisma.member.update({
            where: { id: parseInt(id) },
            data: {
                fullName,
                birthDate: new Date(birthDate),
                type,
                relationship,
                education,
                occupation,
                status,
                memberType,
                whoMember: whoMember || null
            }
        });

        res.json({
            status: true,
            message: "Member updated successfully",
            member: updatedMember
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Error updating member",
            error: error.message
        });
    }
};

module.exports = { editMember }