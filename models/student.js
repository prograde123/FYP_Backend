var mongoose = require("mongoose");
var User = require("../models/user");
var  StudentSchema = mongoose.Schema({
userID:{
    type: mongoose.Types.ObjectId,
    ref: 'User'
  },
userName:{
  type:String,
  required:true
}
})
const Student = mongoose.model("Student", StudentSchema);
module.exports = Student;