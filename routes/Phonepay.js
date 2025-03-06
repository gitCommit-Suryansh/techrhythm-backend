
const express=require('express')
const router=express.Router()
const paymentcontroller=require('../Controllers/Phonepe')

router.post('/phonepe/pay',paymentcontroller.pay)
router.post('/redirect-url/:merchantTransactionId',paymentcontroller.redirect)

    
module.exports=router