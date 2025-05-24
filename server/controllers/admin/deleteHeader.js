

// delete supplier

const prisma = require("../../prismaClieynt");


const deleteHeader = async (req, res) => {

    const id = parseInt(req.params.id)

    try {

        const existingHeader = await prisma.familyHead.findFirst({
            where: { id: id }
        });

        if (!existingHeader) {
            return res.status(404).json({ status: false, message: 'Header not found' });
        }

        await prisma.familyHead.update({
            where: { id: id },

            data: {
                isRemoved: true
            }
        })

        return res.status(200).json({ status: true, message: 'Header deleted successfully!' })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, error: 'server error' })
    }
}

module.exports = { deleteHeader }