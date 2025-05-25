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
const { getBirthCertificate } = require('../controllers/admin/getBirthReq')
const { birthCertificateApprove } = require('../controllers/admin/birthCertiApprove')
const { getMarriageCertification } = require('../controllers/admin/getMarriageReq')
const { marriageCertificateApprove } = require('../controllers/admin/marriageCertiApprove')
const { getDeathCertificate } = require('../controllers/admin/get.deathCerifi')
const { deathCertificationApprove } = require('../controllers/admin/deathCertiApprove')
const { getDivorceCertificate } = require('../controllers/admin/getDivorceReq')
const { divorceCertificateApprove } = require('../controllers/admin/divorceApprov')
const { getBirthDetail } = require('../controllers/admin/birthDetail')
const uploadBirthCertification = require('../controllers/admin/uplodeBirthCertificate')
const uploadIdDocument = require('../controllers/admin/uplodeIdDocument')
const { getDetailMarriage } = require('../controllers/admin/marriageDetail')
const uploadMarriageCertification = require('../controllers/admin/uplodeMarriageCertificate')
const { getDeathDetail } = require('../controllers/admin/deathDetail')
const uploadDeathCertification = require('../controllers/admin/uplodeDeathCerti')
const uploadDivorceCertification = require('../controllers/admin/uplodeDivorceCeri')
const { getDivorceDetail } = require('../controllers/admin/divorceDetail')
const { geNewtMembers } = require('../controllers/admin/getNewMember')
const { getRemoveMembers } = require('../controllers/admin/getRemoveMember')
const { getRejectMembers } = require('../controllers/admin/getRejectMember')
const { getProfile } = require('../controllers/admin/getProfile')
const { editAdminProfile } = require('../controllers/admin/editAdminProfile')
const { totalHeader } = require('../controllers/admin/getTotalHeader')
const { totalMember } = require('../controllers/admin/getTotalMember')
const { totalRejectedMember } = require('../controllers/admin/getTotalRejectedMember')
const { totalPendingMember } = require('../controllers/admin/getPendingMember')
const { totalActiveHeader } = require('../controllers/admin/getActiveHeader')
const { totalIRequest } = require('../controllers/admin/getTotalIdRequest')
const { deleteHeader } = require('../controllers/admin/deleteHeader')
const { removeHeader } = require('../controllers/admin/getRemovedHeaders')
const { deleteMember } = require('../controllers/admin/deleteMember')
const { restoreMember } = require('../controllers/admin/restoreMember')
const { restoreHeader } = require('../controllers/admin/restoreHeader')
const { validation } = require('../controllers/admin/validation')
const { logout } = require('../controllers/admin/logout')
const { updateFamilyHead } = require('../controllers/admin/editHeader')
const { editMember } = require('../controllers/admin/editMember')
const { getDetailMembers } = require('../controllers/admin/getDetailMember')

const router = express.Router()


router.post('/login', adminLogin)
router.post('/add-account', addAccount)
router.post('/add-family-header', addFamilyHead)
// upload documents
router.post('/update-birth-document', uploadBirthCertification)
router.post('/update-marriage-document', uploadMarriageCertification)
router.post('/update-id-document', uploadIdDocument)
router.post('/update-death-document', uploadDeathCertification)
router.post('/update-divorce-document', uploadDivorceCertification)

// validation
router.post('/validate', validation)

// logout
router.post('/logout', logout)

router.get('/get-family-header', getFamilyHeader)
router.get('/get-members', getMembers)
router.get('/get-rejected-member', getMemberRejected)
router.get('/get-detail-member/:id', getDetailMember)
router.get('/get-id-request', getIdRequest)
router.get('/get-id-detail/:id', getDetailIdInfo)
router.get('/get-birth-certificate', getBirthCertificate)
router.get('/get-marriage-certificate', getMarriageCertification)
router.get('/get-death-certificate', getDeathCertificate)
router.get('/get-divorce-certificate', getDivorceCertificate)
router.get('/get-new-member', geNewtMembers)
router.get('/get-removed-member', getRemoveMembers)
router.get('/get-reject-member', getRejectMembers)
router.get('/get-profile', getProfile)
router.get('/get-removed-header', removeHeader)
router.get('/detail-member/:id', getDetailMembers)

// dashboard 
router.get('/get-total-header', totalHeader)
router.get('/get-total-member', totalMember)
router.get('/get-total-rejected-member', totalRejectedMember)
router.get('/get-total-pending-member', totalPendingMember)
router.get('/get-total-active-header', totalActiveHeader)
router.get('/get-total-id', totalIRequest)

// certificate detail info
router.get('/get-birth-detail/:id', getBirthDetail)
router.get('/get-marriage-detail/:id', getDetailMarriage)
router.get('/get-death-detail/:id', getDeathDetail)
router.get('/get-divorce-detail/:id', getDivorceDetail)


router.put('/member-approval/:id', memeberApproved)
router.put('/id-approval/:id', idApproved)
router.put('/birth-certificate-approval/:id', birthCertificateApprove)
router.put('/marriage-certificate-approval/:id', marriageCertificateApprove)
router.put('/death-certificate-approval/:id', deathCertificationApprove)
router.put('/divorce-certificate-approval/:id', divorceCertificateApprove)
router.put('/edit-profile', editAdminProfile)


// remove header

router.put('/delete-header/:id', deleteHeader)
router.put('/delete-member/:id', deleteMember)

// restore

router.put('/restore-member/:id', restoreMember)
router.put('/restore-header/:id', restoreHeader)

// update header

router.put('/edit-header/:id', updateFamilyHead)
router.put('/edit-member/:id', editMember)





module.exports = router