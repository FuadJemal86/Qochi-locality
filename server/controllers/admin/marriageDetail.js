const prisma = require("../../prismaClieynt")


const getDetailMarriage = async (req, res) => {
    const { id } = req.params
    try {
        const getDetailMarriage = await prisma.marriageCertificate.findFirst({
            where: { memberId: Number(id) },
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

        if (!getDetailMarriage) {
            return res.status(400).json({ status: false, message: 'no marriageCertificate found in this id' })
        }

        return res.status(200).json({ status: true, getDetailMarriage })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, message: 'server error' })
    }
}

module.exports = { getDetailMarriage }