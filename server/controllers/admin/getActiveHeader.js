const prisma = require("../../prismaClieynt")

const totalActiveHeader = async (req, res) => {
    try {
        const totalActiveHeader = await prisma.familyHead.count({
            where: { isRemoved: false }
        })

        if (totalActiveHeader.length === 0) {
            return res.status(400).json({ status: false, message: 'no active Header founded' })
        }

        return res.status(200).json({ status: true, totalActiveHeader })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, message: 'serve error' })
    }
}


module.exports = { totalActiveHeader }