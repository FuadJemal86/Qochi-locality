const express = require('express')
const { user } = require('../controllers/user/user.login')

const router = express.Router()


router.post('/login', user)


module.exports = router