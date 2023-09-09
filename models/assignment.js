var mongoose = require("mongoose");
const Schema = mongoose.Schema
const AssignmentSchema = new Schema({
  CourseID:{
    type:mongoose.Types.ObjectId,
    ref:'Course'
  },
  assignmentNumber: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  uploadDate: {
    type: Date,
    default: Date.now(),
  },
  dueDate: {
    type: Date,
    required: true,
  },
  totalMarks: {
    type: Number,
    required: true,
  },
  format: {
    type: String,
    required: true,
  },
  noOfQuestions: {
    type: Number,
    required: true,
  }

 
});

module.exports = mongoose.model("Assignment", AssignmentSchema);
