const prisma = require("../../prismaClieynt")


const idApproved = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        // Validate the ID and status
        if (!id || !status) {
            return res.status(400).json({ status: false, message: 'ID and status are required' });
        }

        const isApproved = await prisma.iDRequest.update({
            where: { id: Number(id) },
            data: {
                status: status
            }
        });

        return res.status(200).json({ status: true, message: `The status changed to ${status}` });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, message: 'Server error' });
    }
};

module.exports = { idApproved }