const express=require('express')
const router=express.Router()
const verifyController=require('../Controllers/Verify')

router
    .post('/verifypass',verifyController.verifyPass)

module.exports=router