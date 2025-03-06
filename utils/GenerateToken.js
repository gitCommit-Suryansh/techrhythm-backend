const jwt=require('jsonwebtoken')
require('dotenv').config();

const generateToken=(user)=>{
  return jwt.sign({
    id: user._id,
    email: user.email,
    fullName: user.fullName,
    phone: user.phone,
    college: user.college,
    passId: user.passId || null,
    passType: user.passType,
    passAmount: user.passAmount
  }, process.env.JWT_KEY)
}

module.exports.generateToken = generateToken