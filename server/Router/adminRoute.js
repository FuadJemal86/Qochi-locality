const express = require('express')
const { adminLogin } = require('../controllers/admin/admin.login')
const { addAccount } = require('../controllers/admin/add.account')

const router = express.Router()


router.post('/login', adminLogin)
router.post('/add-account', addAccount)


module.exports = router