var mongoose = require("mongoose");
const Schema = mongoose.Schema;
const QuestionSchema = new Schema({
  Assignment:{
    type: mongoose.Types.ObjectId,
    ref: 'Assignment'
  },
  questionDescription: {
    type: String,
    required: true,
  },
  questionTotalMarks: {
    type: Number,
    required: true,
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
