var mongoose = require("mongoose");
const TestCasesSchema = new Schema({
  testCaseID: {
    type: Number,
    required: true,
  },
  input: {
    type: String,
    required: true,
  },
  expectedOutput: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("TestCase", TestCasesSchema);
