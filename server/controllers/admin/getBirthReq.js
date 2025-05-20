const prisma = require("../../prismaClieynt")

const getBirthCertificate = async (req, res) => {
    try {
        const getBirthCertificate = await prisma.birthCertificate.findMany({
            include: {
                familyHead: {
                    select: {
                        id: true,
                        fullName: true
                    }
                }
            }
        })

        if (getBirthCertificate.length === 0) {
            return res.status(400).json({ status: false, message: 'no id request founded' })
        }

        return res.status(200).json({ status: true, getBirthCertificate })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, message: 'server error' })
    }
}

module.exports = { getBirthCertificate }

