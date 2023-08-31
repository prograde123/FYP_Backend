var mongoose = require("mongoose");
const Schema = mongoose.Schema;
const QuestionSchema = new Schema({
  questionDescription: {
    type: String,
    required: true,
  },
  questionTotalMarks: {
    type: Number,
    required: true,
  },
  testCases: {
    type: [
      {
        type: mongoose.Types.ObjectId,
        ref: "TestCase",
      },
    ],
  },
  submissionFile: {
    type: mongoose.Types.ObjectId,
    ref: "Submission",
  },
  isInputArray: {
    type:Boolean,
    required: true,
    default: false,

  }
});

module.exports = mongoose.model("Question", QuestionSchema);
