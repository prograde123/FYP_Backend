var mongoose = require("mongoose");

const TestResultSchema =mongoose.Schema({
  testCase: {
    type: mongoose.Types.ObjectId,
    ref: "TestCase",
  },
  actualOutput: {
    type: String,
    required: true,
  },
  errorOutput: {
    type: String,
    default: '',
  },
  passed: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model("TestResult", TestResultSchema);
