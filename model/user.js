const mongoose=require('mongoose')

const userSchema=mongoose.Schema({
    fullName:{type:String,required:true},
    email:{type:String,required:true},
    college:{type:String,required:true},
    phone:{type:String,required:true},
    password:{type:String,required:true},
    passType:{type:String,enum:['Silver','Gold','Platinum'],required:false},
    passAmount:{type:String,required:false},
    paymentDetails:{type:Object,default:null,required:false},
    passId:{type:String,default:null,required:false},
    checkedIn:{type:Boolean,default:false}
})

module.exports=mongoose.model('user',userSchema)