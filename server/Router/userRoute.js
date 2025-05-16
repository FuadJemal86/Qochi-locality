const express = require('express')
const { user } = require('../controllers/user/user.login')
const { addMember } = require('../controllers/user/add.members')
const { getMembers } = require('../controllers/user/get.members')
const { getMemberRejected } = require('../controllers/user/get.member.rejected')
const { getEditedMember } = require('../controllers/user/get.edited.member')

const router = express.Router()


router.post('/login', user)
router.post('/add-members', addMember)


router.get('/get-members', getMembers)
router.get('/get-rejected-memeber', getMemberRejected)
router.get('/get-edited-member', getEditedMember)


module.exports = router