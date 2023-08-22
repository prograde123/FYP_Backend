var mongoose = require("mongoose");
const SubmissionSchema = new Schema({
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
    required: true,
  },
  feedback: { //display the testcases results as passed and failed to user
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Submission", SubmissionSchema);
