const prisma = require("../../prismaClieynt")

const getIdRequest = async (req, res) => {
    try {
        const getIdRequest = await prisma.iDRequest.findMany({
            include: {
                familyHead: {
                    select: {
                        id: true,
                        fullName: true
                    }
                }
            }
        })

        if (getIdRequest.length === 0) {
            return res.status(400).json({ status: false, message: 'no id request founded' })
        }

        return res.status(200).json({ status: true, getIdRequest })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, message: 'server error' })
    }
}

module.exports = { getIdRequest }

