var mongoose = require("mongoose");
const TestResultSchema = new Schema({
  testCase: {
    type: mongoose.Types.ObjectId,
    ref: "TestCase",
  },
  actualOutput: {
    type: String,
    required: true,
  },
  passed: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model("TestResult", TestResultSchema);
