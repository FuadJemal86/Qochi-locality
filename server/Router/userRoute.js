const express = require('express')
const { user } = require('../controllers/user/user.login')
const { addMember } = require('../controllers/user/add.members')
const { getMembers } = require('../controllers/user/get.members')
const { getMemberRejected } = require('../controllers/user/get.member.rejected')
const { getEditedMember } = require('../controllers/user/get.edited.member')
const { idRequest } = require('../controllers/user/idRequest')
const { getMembersId } = require('../controllers/user/get.id.memers')

const router = express.Router()


router.post('/login', user)
router.post('/add-members', addMember)
router.post('/request-id/:id', idRequest)


router.get('/get-members', getMembers)
router.get('/get-rejected-memeber', getMemberRejected)
router.get('/get-edited-member', getEditedMember)
router.get('/get-member-id', getMembersId)


module.exports = router