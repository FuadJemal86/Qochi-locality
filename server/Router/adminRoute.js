const express = require('express')
const { adminLogin } = require('../controllers/admin/admin.login')
const { addAccount } = require('../controllers/admin/add.account')
const { addFamilyHead } = require('../controllers/admin/add.family.header')
const { getFamilyHeader } = require('../controllers/admin/get.family.header')

const router = express.Router()


router.post('/login', adminLogin)
router.post('/add-account', addAccount)
router.post('/add-family-header', addFamilyHead)
router.get('/get-family-header', getFamilyHeader)


module.exports = router