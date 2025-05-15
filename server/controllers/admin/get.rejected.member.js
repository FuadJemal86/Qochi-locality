const jwt = require('jsonwebtoken')
const prisma = require('../../prismaClieynt')

const getMemberRejected = async (req, res) => {

    try {
        const rejectedMember = await prisma.member.findMany({
            where: { isApproved: 'REJECTED' }
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