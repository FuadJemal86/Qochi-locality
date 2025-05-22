const express = require('express')
const { user } = require('../controllers/user/user.login')
const { addMember } = require('../controllers/user/add.members')
const { getMembers } = require('../controllers/user/get.members')
const { getMemberRejected } = require('../controllers/user/get.member.rejected')
const { getEditedMember } = require('../controllers/user/get.edited.member')
const { idRequest } = require('../controllers/user/idRequest')
const { getMembersId } = require('../controllers/user/get.id.memers')
const { getVitalEvent } = require('../controllers/user/vital.event')
const { requestBirthCertificate } = require('../controllers/user/birthCerteficate')
const { requestDeathCertificate } = require('../controllers/user/deathCertificate')
const { requestMarriageCertificate } = require('../controllers/user/marriageCertificate')
const { requestDivorceCertificate } = require('../controllers/user/divorceCertificate')
const { getAllDocuments } = require('../controllers/user/getAllDocumets')
const { getRemoveMembers } = require('../controllers/user/getRemovedMembers')
const { getProfile } = require('../controllers/user/getProfile')

const router = express.Router()


router.post('/login', user)
router.post('/add-members', addMember)
router.post('/request-id/:id', idRequest)
router.post('/request-birth-certificate/:id', requestBirthCertificate)
router.post('/request-death-certificate/:id', requestDeathCertificate)
router.post('/request-marriage-certificate/:id', requestMarriageCertificate)
router.post('/request-divorce-certificate/:id', requestDivorceCertificate)


router.get('/get-members', getMembers)
router.get('/get-rejected-memeber', getMemberRejected)
router.get('/get-edited-member', getEditedMember)
router.get('/get-member-id', getMembersId)
router.get('/get-vital-event', getVitalEvent)
router.get('/get-all-documents', getAllDocuments)
router.get('/get-removed-member', getRemoveMembers)
router.get('/get-profile', getProfile)


module.exports = router