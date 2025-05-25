const prisma = require("../../prismaClieynt");

const updateFamilyHead = async (req, res) => {
    try {
        const { id } = req.params;
        const { fullName, contactInfo, email, houseNumber, familysize, type } = req.body;

        // Check if email exists for other users
        const existingFamilyHead = await prisma.familyHead.findFirst({
            where: {
                email,
                NOT: { id: parseInt(id) }
            }
        });

        if (existingFamilyHead) {
            return res.status(409).json({
                status: false,
                message: 'Email already exists'
            });
        }

        const updatedFamilyHead = await prisma.familyHead.update({
            where: { id: parseInt(id) },
            data: { fullName, contactInfo, email, houseNumber, familysize, type }
        });

        res.json({
            status: true,
            message: 'Family head updated successfully',
            data: updatedFamilyHead
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: false,
            message: 'Internal server error'
        });
    }
};


module.exports = { updateFamilyHead }