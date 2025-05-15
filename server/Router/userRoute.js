const express = require('express')
const { user } = require('../controllers/user/user.login')
const { addMember } = require('../controllers/user/add.members')
const { getMembers } = require('../controllers/user/get.members')

const router = express.Router()


router.post('/login', user)
router.post('/add-members', addMember)


router.get('/get-members', getMembers)


module.exports = router