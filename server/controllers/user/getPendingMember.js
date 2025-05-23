const prisma = require("../../prismaClieynt")

const totalPendingMember = async (req, res) => {
    const token = req.cookies['fh-auth-token']

    if (!token) {
        return res.status(401).json({ status: false, message: 'no token is provide' })
    }

    let headeId
    try {
        const decoded = jwt.verify(token, process.env.USER_KEY)

        headeId = decoded.id

        const totalPendingMember = await prisma.member.count({
            where: { headId: Number(headeId), isApproved: 'PENDING' }

        })

        if (totalPendingMember.length === 0) {
            return res.status(400).json({ status: false, message: 'no pending member founded' })
        }

        return res.status(200).json({ status: true, totalPendingMember })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, message: 'serve error' })
    }
}


module.exports = { totalPendingMember }