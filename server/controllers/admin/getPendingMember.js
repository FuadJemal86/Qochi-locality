const prisma = require("../../prismaClieynt")

const totalPendingMember = async (req, res) => {
    try {
        const totalPendingMember = await prisma.member.count({
            where: { isApproved: 'PENDING', isRemoved: false }
        })

        if (totalPendingMember.length === 0) {
            return res.status(400).json({ status: false, message: 'no rejected member founded' })
        }

        return res.status(200).json({ status: true, totalPendingMember })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, message: 'serve error' })
    }
}


module.exports = { totalPendingMember }