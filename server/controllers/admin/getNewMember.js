const prisma = require("../../prismaClieynt");
const jwt = require('jsonwebtoken')

const geNewtMembers = async (req, res) => {

    try {

        const familyNewMembers = await prisma.member.findMany({
            where: { isApproved: 'PENDING', isRemoved: false }
        })

        return res.status(200).json({ status: true, familyNewMembers })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, message: 'server error' })
    }
}

module.exports = { geNewtMembers }