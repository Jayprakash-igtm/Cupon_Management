const express = require ('express');
const {assignCouponToUser} = require('../controller/cuponController.js');

const router = express.Router();

router.get('/claim', assignCouponToUser);



module.exports = router;