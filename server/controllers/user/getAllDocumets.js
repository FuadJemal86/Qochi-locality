const prisma = require("../../prismaClieynt");
const jwt = require('jsonwebtoken')

const getAllDocuments = async (req, res) => {
    const token = req.cookies['fh-auth-token']

    if (!token) {
        return res.status(400).json({ status: false, message: 'no token provided' });
    }
    let headId
    try {
        const decoded = jwt.verify(token, process.env.USER_KEY);
        headId = decoded.id;

        const getAllDocuments = await prisma.certiAndId.findMany({
            where: { familyHeadId: Number(headId) },
            include: {
                member: {
                    select: {
                        fullName: true
                    }
                }
            }
        })

        if (!getAllDocuments) {
            return res.status(400).json({ status: false, message: 'no Documents  founded' })
        }

        return res.status(200).json({ status: true, getAllDocuments })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, message: 'server error' })
    }
}

module.exports = { getAllDocuments }