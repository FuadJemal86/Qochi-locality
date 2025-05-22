const prisma = require("../../prismaClieynt");
const jwt = require('jsonwebtoken')

const getRemoveMembers = async (req, res) => {

    const token = req.cookies['fh-auth-token']

    if (!token) {
        return res.status(400).json({ status: false, message: 'no token provided' });
    }
    let headId

    try {

        const decoded = jwt.verify(token, process.env.USER_KEY);
        headId = decoded.id;

        const familyRemoveMembers = await prisma.member.findMany({
            where: { headId: parseInt(headId), isRemoved: true }
        })

        return res.status(200).json({ status: true, familyRemoveMembers })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, message: 'server error' })
    }
}

module.exports = { getRemoveMembers }