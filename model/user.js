const mongoose=require('mongoose')

const userSchema=mongoose.Schema({
    fullName:{type:String,required:true},
    email:{type:String,required:true},
    college:{type:String,required:true},
    phone:{type:String,required:true},
    password:{type:String,required:true},
    pass:{type:String,enum:['Silver','Gold','Platinum'],required:false},
})

module.exports=mongoose.model('user',userSchema)