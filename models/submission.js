var mongoose = require("mongoose");
const SubmissionSchema = mongoose.Schema({
  question:{
    type: mongoose.Types.ObjectId,
    ref: "Question",
  },
  student: {
    type: mongoose.Types.ObjectId,
    ref: "Student",
  },
  submittedDate: {
    type: Date,
    required: true,
  },
  codeFile: {
    type: String,
    required: true,
  },
  testResults: {
    type: [
      {
        type: mongoose.Types.ObjectId,
        ref: "TestResult",
      },
    ],
  },
  plagairismReport: {
    type: mongoose.Types.ObjectId,
    ref: "PlagairismReport",
  },
  obtainedMarks: {
    type: Number,
    default:0
  },
});

module.exports = mongoose.model("Submission", SubmissionSchema);
