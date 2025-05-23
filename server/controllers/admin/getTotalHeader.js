const prisma = require("../../prismaClieynt")

const totalHeader = async (req, res) => {
    try {
        const totalHeader = await prisma.familyHead.count()

        if (totalHeader.length === 0) {
            return res.status(400).json({ status: false, message: 'no header founded' })
        }

        return res.status(200).json({ status: true, totalHeader })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, message: 'serve error' })
    }
}


module.exports = { totalHeader }