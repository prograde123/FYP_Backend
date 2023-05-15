var mongoose = require("mongoose");
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

module.exports = mongoose.model("Student", StudentSchema);