var mongoose = require("mongoose");
var User = require("../models/user");
var  TeacherSchema = mongoose.Schema({
userID: {
    type: mongoose.Types.ObjectId,
    ref: 'User'
},
cv:{
    type: String,
    required : true
}
})
const Teacher = mongoose.model("Teacher", TeacherSchema);
module.exports = Teacher;