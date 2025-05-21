const jwt = require('jsonwebtoken');
const prisma = require('../../prismaClieynt');

const getVitalEvent = async (req, res) => {
    const token = req.cookies['fh-auth-token'];

    if (!token) {
        return res.status(400).json({ status: false, message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.USER_KEY);
        const headId = decoded.id;

        // Get all members of the family head
        const members = await prisma.member.findMany({
            where: {
                headId: Number(headId), OR: [
                    { isApproved: 'APPROVED' },
                    { isApproved: 'REJECTED' },
                ],
            },
            include: {
                birthCertificates: { select: { status: true } },
                deathCertificates: { select: { status: true } },
                divorceCertificate: { select: { status: true } },
                marriageCertificates: { select: { status: true } }

            }
        });


        return res.status(200).json({
            status: true,
            vitalEvent: {
                members
            }
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, message: 'Server error' });
    }
};

module.exports = { getVitalEvent };
