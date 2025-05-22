const prisma = require("../../prismaClieynt")


const getDeathDetail = async (req, res) => {
    const { id } = req.params
    try {
        const getDetailDeath = await prisma.deathCertificate.findFirst({
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

        if (!getDetailDeath) {
            return res.status(400).json({ status: false, message: 'no Death certificate found in this id' })
        }

        return res.status(200).json({ status: true, getDetailDeath })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, message: 'server error' })
    }
}

module.exports = { getDeathDetail }