const prisma = require("../../prismaClieynt")


const getBirthDetail = async (req, res) => {
    const { id } = req.params
    try {
        const getDetailBirth = await prisma.birthCertificate.findFirst({
            where: { familyHeadId: Number(id) },
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

        if (!getDetailBirth) {
            return res.status(400).json({ status: false, message: 'no birthCertificate found in this id' })
        }

        return res.status(200).json({ status: true, getDetailBirth })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, message: 'server error' })
    }
}

module.exports = { getBirthDetail }