const express=require('express')
const router=express.Router()
const registercontroller=require('../Controllers/Register')

router
    .post('/registerPass',registercontroller.registerPass)

module.exports=router