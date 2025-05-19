const prisma = require("../../prismaClieynt")


const getDetailIdInfo = async (req, res) => {
    const { id } = req.params
    try {
        const getDetailId = await prisma.iDRequest.findFirst({
            where: { id: Number(id) },
            include: {
                familyHead: {
                    select: {
                        fullName: true
                    }
                },
                member: {
                    select: {
                        type: true
                    }
                }
            }
        })

        if (!getDetailId) {
            return res.status(400).json({ status: false, message: 'no ID found in this id' })
        }

        return res.status(200).json({ status: true, getDetailId })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, message: 'server error' })
    }
}

module.exports = { getDetailIdInfo }