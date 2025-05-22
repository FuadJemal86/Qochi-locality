const prisma = require("../../prismaClieynt");
const jwt = require('jsonwebtoken')

const getRejectMembers = async (req, res) => {

    try {

        const familyRejectMembers = await prisma.member.findMany({
            where: { isApproved: 'REJECTED' }
        })

        return res.status(200).json({ status: true, familyRejectMembers })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, message: 'server error' })
    }
}

module.exports = { getRejectMembers }