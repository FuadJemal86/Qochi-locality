const prisma = require("../../prismaClieynt")


const getDivorceDetail = async (req, res) => {
    const { id } = req.params
    try {
        const getDetailDivorce = await prisma.divorceCertificate.findFirst({
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

        if (!getDetailDivorce) {
            return res.status(400).json({ status: false, message: 'no Divorce certificate found in this id' })
        }

        return res.status(200).json({ status: true, getDetailDivorce })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, message: 'server error' })
    }
}

module.exports = { getDivorceDetail }