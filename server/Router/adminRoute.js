const express = require('express')
const { adminLogin } = require('../controllers/admin/admin.login')
const { addAccount } = require('../controllers/admin/add.account')
const { addFamilyHead } = require('../controllers/admin/add.family.header')
const { getFamilyHeader } = require('../controllers/admin/get.family.header')
const { getMembers } = require('../controllers/admin/get.members')
const { memeberApproved } = require('../controllers/admin/memebr.approved')
const { getMemberRejected } = require('../controllers/admin/get.rejected.member')
const { getDetailMember } = require('../controllers/admin/get.detail.member')

const router = express.Router()


router.post('/login', adminLogin)
router.post('/add-account', addAccount)
router.post('/add-family-header', addFamilyHead)

router.get('/get-family-header', getFamilyHeader)
router.get('/get-members', getMembers)
router.get('/get-rejected-member', getMemberRejected)
router.get('/get-detail-member/:id', getDetailMember)


router.put('/member-approval/:id', memeberApproved)


module.exports = router