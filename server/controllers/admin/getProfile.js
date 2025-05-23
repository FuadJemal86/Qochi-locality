const prisma = require("../../prismaClieynt");
const jwt = require('jsonwebtoken')

const getProfile = async (req, res) => {
    const token = req.cookies['admin-token']

    if (!token) {
        return res.status(400).json({ status: false, message: 'no token provided' });
    }
    let id
    try {
        const decoded = jwt.verify(token, process.env.ADMIN_KEY);
        id = decoded.id;

        const getProfile = await prisma.admin.findFirst({
            where: { id: Number(id) },

            select: {
                name: true,
                image: true,
                email: true
            }
        })

        if (!getProfile) {
            return res.status(400).json({ status: false, message: 'no admin founded' })
        }

        return res.status(200).json({ status: true, getProfile })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, message: 'server error' })
    }
}

module.exports = { getProfile }