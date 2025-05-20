const jwt = require('jsonwebtoken');
const prisma = require('../../prismaClieynt');

// Get marriages where member is a wife or husband
const getVitalEvent = async (req, res) => {
    const token = req.cookies['fh-auth-token']

    if (!token) {
        return res.status(400).json({ status: false, message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.USER_KEY);
        const headId = decoded.id;

        // Get members under this head
        const members = await prisma.member.findMany({
            where: { headId: Number(headId) },
            include: {
                birthCertificates: {
                    select: { status: true }
                },
                deathCertificates: {
                    select: { status: true }
                },
                divorceCertificate: {
                    select: { status: true }
                }
            }
        });

        // Get marriages where member is a wife or husband
        const marriages = await prisma.marriageCertificate.findMany({
            where: {
                OR: [
                    { wife: { headId: Number(headId) } },
                    { husband: { headId: Number(headId) } }
                ]
            },
            select: {
                status: true
            }
        });

        return res.status(200).json({
            status: true,
            vitalEvent: {
                members,
                marriages
            }
        });
    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, message: 'Server error' })
    }
}


module.exports = { getVitalEvent }