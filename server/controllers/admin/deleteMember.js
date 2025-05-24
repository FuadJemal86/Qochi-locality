

// delete supplier

const prisma = require("../../prismaClieynt");


const deleteMember = async (req, res) => {

    const id = parseInt(req.params.id)

    try {

        const existingMember = await prisma.member.findFirst({
            where: { id: id }
        });

        if (!existingMember) {
            return res.status(404).json({ status: false, message: 'member not found' });
        }

        await prisma.member.update({
            where: { id: id },

            data: {
                isRemoved: true
            }
        })

        return res.status(200).json({ status: true, message: 'member deleted successfully!' })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, error: 'server error' })
    }
}

module.exports = { deleteMember }