const prisma = require("../../prismaClieynt")


const getDetailMember = async (req, res) => {
    const { id } = req.params
    try {
        const getDetailMember = await prisma.member.findFirst({
            where: { id: Number(id) },

            select: {
                fullName: true,
                birthDate: true,
                type: true,
                relationship: true,
                education: true,
                occupation: true,
                image: true,
                birthCertificate: true,
                deathCertificate: true,
                marriageCertificate: true,
                status: true,
                memberType: true,
                whoMember: true
            }
        })

        if (!getDetailMember) {
            return res.status(400).json({ status: false, message: 'no member found in this id' })
        }

        return res.status(200).json({ status: true, getDetailMember })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, message: 'server error' })
    }
}

module.exports = { getDetailMember }