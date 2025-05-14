const prisma = require("../../prismaClieynt")

const getFamilyHeader = async (req, res) => {
    try {
        const familyHeader = await prisma.familyHead.findMany();

        if (familyHeader.length === 0) {
            return res.status(200).json({ status: false, message: 'No family header found' });
        }

        return res.status(200).json({ status: true, familyHeader });
    } catch (err) {
        console.error('Error fetching family headers:', err);
        return res.status(500).json({ status: false, message: 'Server error' });
    }
};


module.exports = { getFamilyHeader }