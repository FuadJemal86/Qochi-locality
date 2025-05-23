const prisma = require("../../prismaClieynt")

const totalIRequest = async (req, res) => {
    try {
        const totalIRequest = await prisma.member.count()

        if (totalIRequest.length === 0) {
            return res.status(400).json({ status: false, message: 'id no founded' })
        }

        return res.status(200).json({ status: true, totalIRequest })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, message: 'serve error' })
    }
}


module.exports = { totalIRequest }