const express=require('express')
const router=express.Router()
const authcontroller=require('../Controllers/AuthController')

router
    .post('/Signup',authcontroller.Signup)
    .post('/Login',authcontroller.Login)

module.exports=router