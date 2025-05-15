const prisma = require("../../prismaClieynt");
const jwt = require('jsonwebtoken')

const getMembers = async (req, res) => {

    try {

        const familyMembers = await prisma.familyHead.findMany({
            include: {
                members: true
            }
        })

        return res.status(200).json({ status: true, familyMembers })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, message: 'server error' })
    }
}

module.exports = { getMembers }