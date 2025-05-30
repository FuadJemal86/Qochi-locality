const prisma = require("../../prismaClieynt")
const jwt = require('jsonwebtoken')


const totalActiveMember = async (req, res) => {
    const token = req.cookies['fh-auth-token']

    if (!token) {
        return res.status(401).json({ status: false, message: 'no token is provide' })
    }

    let headeId
    try {
        const decoded = jwt.verify(token, process.env.USER_KEY)

        headeId = decoded.id

        const totalActiveMember = await prisma.member.count({
            where: { headId: Number(headeId), isApproved: 'APPROVED' }

        })

        if (totalActiveMember.length === 0) {
            return res.status(400).json({ status: false, message: 'no active member founded' })
        }

        return res.status(200).json({ status: true, totalActiveMember })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, message: 'serve error' })
    }
}


module.exports = { totalActiveMember }