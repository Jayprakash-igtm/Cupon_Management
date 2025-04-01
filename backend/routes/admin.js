const express = require ('express');
const { getLoggedin } = require('../controller/authController.js');
const {addNewCoupon,updateCoupon, getAllCoupon,getAdminOverviewofClaim} = require('../controller/adminController.js')
const {verifyAdmin} = require('../middleware/auth.js')
const router = express.Router();

router.post('/login', getLoggedin);

router.post('/addCoupon',verifyAdmin, addNewCoupon);

router.patch('/updateCoupon/:id',verifyAdmin, updateCoupon);

router.get('/getallcoupons',verifyAdmin, getAllCoupon);

router.get('/ClaimHistory',verifyAdmin, getAdminOverviewofClaim)

module.exports = router;