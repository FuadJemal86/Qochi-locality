const prisma = require("../../prismaClieynt")

const totalRejectedMember = async (req, res) => {
    try {
        const totalRejectedMember = await prisma.member.count({
            where: { isApproved: 'REJECTED' }
        })

        if (totalRejectedMember.length === 0) {
            return res.status(400).json({ status: false, message: 'no rejected member founded' })
        }

        return res.status(200).json({ status: true, totalRejectedMember })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, message: 'serve error' })
    }
}


module.exports = { totalRejectedMember }