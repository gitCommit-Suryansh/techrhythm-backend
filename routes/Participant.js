const express=require('express')
const router=express.Router()
const participantController=require('../Controllers/ParticipantController')

router
    .get('/allparticipants',participantController.allparticipants)
    .post('/updatepassid',participantController.updatepassid)

module.exports=router