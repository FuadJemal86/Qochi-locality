const prisma = require("../../prismaClieynt");
const jwt = require('jsonwebtoken')

const getRemoveMembers = async (req, res) => {

    try {

        const familyRemoveMembers = await prisma.member.findMany({
            where: { isRemoved: true }
        })

        return res.status(200).json({ status: true, familyRemoveMembers })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, message: 'server error' })
    }
}

module.exports = { getRemoveMembers }