const jwt = require('jsonwebtoken')
const prisma = require('../../prismaClieynt')

const getMemberRejected = async (req, res) => {

    const token = req.cookies['fh-auth-token']

    if (!token) {
        return res.status(401).json({ status: false, message: 'no token is provide' })
    }

    let headeId
    try {
        const decoded = jwt.verify(token, process.env.USER_KEY)

        headeId = decoded.id
    } catch (err) {
        console.log(err)
        return res.status(400).json({ status: false, message: 'unverified token!' })
    }

    try {
        const rejectedMember = await prisma.member.findMany({
            where: { headId: Number(headeId), isApproved: 'REJECTED' }
        })

        if (rejectedMember.length === 0) {
            return res.status(400).json({ status: false, message: 'no rejeted member is founded' })
        }

        return res.status(200).json({ status: true, rejectedMember })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, message: 'server error' })
    }
}

module.exports = { getMemberRejected }