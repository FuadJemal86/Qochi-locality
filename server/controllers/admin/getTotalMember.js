const prisma = require("../../prismaClieynt")

const totalMember = async (req, res) => {
    try {
        const totalMember = await prisma.member.count()

        if (totalMember.length === 0) {
            return res.status(400).json({ status: false, message: 'no member founded' })
        }

        return res.status(200).json({ status: true, totalMember })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, message: 'serve error' })
    }
}


module.exports = { totalMember }