const prisma = require("../../prismaClieynt");

const getMembers = async (req, res) => {

    try {

        const familyMembers = await prisma.member.findMany({
            where: { isRemoved: false },
            include: {
                head: {
                    select: {
                        fullName: true
                    }
                }
            }
        })

        return res.status(200).json({ status: true, familyMembers })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, message: 'server error' })
    }
}

module.exports = { getMembers }