const express=require('express')
const router=express.Router()
const verifyController=require('../Controllers/Verify')

router
    .post('/verifypass',verifyController.verifyPass)
    .post('/checkIn',verifyController.checkIn)

module.exports=router