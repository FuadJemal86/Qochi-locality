const prisma = require("../../prismaClieynt");

const getDetailMembers = async (req, res) => {
    try {
        const { id } = req.params;


        if (!id) {
            return res.status(400).json({ status: false, message: 'id not sent!' });
        }

        const familyMembers = await prisma.member.findMany({
            where: { headId: Number(id) }
        });

        if (familyMembers.length === 0) {
            return res.status(404).json({ status: false, message: 'No family members found' });
        }

        return res.status(200).json({ status: true, familyMembers });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, message: 'Server error' });
    }
};

module.exports = { getDetailMembers };
