const express = require('express')
const { adminLogin } = require('../controllers/admin/admin.login')
const { addAccount } = require('../controllers/admin/add.account')
const { addFamilyHead } = require('../controllers/admin/add.family.header')
const { getFamilyHeader } = require('../controllers/admin/get.family.header')
const { getMembers } = require('../controllers/admin/get.members')
const { memeberApproved } = require('../controllers/admin/memebr.approved')
const { getMemberRejected } = require('../controllers/admin/get.rejected.member')
const { getDetailMember } = require('../controllers/admin/get.detail.member')
const { getIdRequest } = require('../controllers/admin/get.id.request')
const { idApproved } = require('../controllers/admin/idApproved')
const { getDetailIdInfo } = require('../controllers/admin/get.detail.id')

const router = express.Router()


router.post('/login', adminLogin)
router.post('/add-account', addAccount)
router.post('/add-family-header', addFamilyHead)

router.get('/get-family-header', getFamilyHeader)
router.get('/get-members', getMembers)
router.get('/get-rejected-member', getMemberRejected)
router.get('/get-detail-member/:id', getDetailMember)
router.get('/get-id-request', getIdRequest)
router.get('/get-id-detail/:id', getDetailIdInfo)


router.put('/member-approval/:id', memeberApproved)
router.put('/id-approval/:id', idApproved)


module.exports = router