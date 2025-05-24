const prisma = require("../../prismaClieynt");
const jwt = require('jsonwebtoken')

const removeHeader = async (req, res) => {

    try {

        const removeHeader = await prisma.familyHead.findMany({
            where: { isRemoved: true }
        })

        return res.status(200).json({ status: true, removeHeader })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, message: 'server error' })
    }
}

module.exports = { removeHeader }