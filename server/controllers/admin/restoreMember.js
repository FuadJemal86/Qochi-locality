

// delete supplier

const prisma = require("../../prismaClieynt");


const restoreMember = async (req, res) => {

    const id = parseInt(req.params.id)

    try {

        const existingHeader = await prisma.member.findFirst({
            where: { id: id }
        });

        if (!existingHeader) {
            return res.status(404).json({ status: false, message: 'member not found' });
        }

        await prisma.member.update({
            where: { id: id },

            data: {
                isRemoved: false
            }
        })

        return res.status(200).json({ status: true, message: 'member deleted successfully!' })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, error: 'server error' })
    }
}

module.exports = { restoreMember }