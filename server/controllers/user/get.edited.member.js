const prisma = require("../../prismaClieynt")


const getEditedMember = async (req, res) => {
    const { id } = req.params

    try {
        const getEditedMember = await prisma.member.findFirst({
            where: { id: Number(id) }
        })

        if (getEditedMember.length === 0) {
            return res.status(400).json({ status: false, message: 'member not founded' })
        }

        return res.status(200).json({ status: true, getEditedMember })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, message: 'server error' })
    }
}

module.exports = { getEditedMember }