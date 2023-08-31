var bcrypt = require("bcryptjs");
var mongoose = require("mongoose");
var  UserSchema = mongoose.Schema({
fullName:{
    type: String,
    required : true
},
email:{
    type: String,
    required : true,
    unique:true
},
password:{
    type:String,
    required: true,
},
role:{
    type: String,
    required: true
},
profilePic:{
    type: String
}

})

//Password decrypting and encrypting
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
  }
  
  UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
      next()
    }
  
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
  })
  module.exports = mongoose.model("User", UserSchema);

