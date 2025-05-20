const prisma = require("../../prismaClieynt")

const getDeathCertificate = async (req, res) => {
    try {
        const getDeathCertificate = await prisma.deathCertificate.findMany({
            include: {
                familyHead: {
                    select: {
                        id: true,
                        fullName: true
                    }
                }
            }
        })

        if (getDeathCertificate.length === 0) {
            return res.status(400).json({ status: false, message: 'no id request founded' })
        }

        return res.status(200).json({ status: true, getDeathCertificate })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, message: 'server error' })
    }
}

module.exports = { getDeathCertificate }

