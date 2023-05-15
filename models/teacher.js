var mongoose = require("mongoose");
var TeacherSchema = mongoose.Schema({
  userID: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  cv: {
    type: String,
    required: true,
  },
  approved: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Teacher", TeacherSchema);
