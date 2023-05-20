var mongoose = require("mongoose");
const Schema = mongoose.Schema
const AssignmentSchema = new Schema({
  assignmentNumber: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
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
  assignmentFile: {
    type: String,
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
  submittedAssignment: {
    type: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Submission",
      },
    ],
  },
});

module.exports = mongoose.model("Assignment", AssignmentSchema);
