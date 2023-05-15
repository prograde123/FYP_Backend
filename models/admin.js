var mongoose = require("mongoose");
var AdminSchema = mongoose.Schema({
  userID: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  requests: {
    type: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Teacher",
      },
    ],
  },
});

module.exports = mongoose.model("Admin", AdminSchema);