var mongoose = require("mongoose");
var PlagiarismReportSchema = mongoose.Schema({
  Assignment:{
    type: mongoose.Types.ObjectId,
    ref: 'Assignment'
  },
  User: {
    type: mongoose.Types.ObjectId,
    ref: "User"
  },
  Overall_PlagiarismPercentage : {
    type : Number,
  },
  Checked_With_No_Of_Submissions:{
    type:Number
  }
  
});

module.exports = mongoose.model("PlagairismReport", PlagiarismReportSchema);
