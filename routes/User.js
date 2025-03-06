const express=require('express')
const router=express.Router()
const userController=require('../Controllers/UserController')

router
    .get('/getuser/:userId',userController.getuser)

module.exports=router