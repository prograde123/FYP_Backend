var mongoose = require("mongoose");

const Schema = mongoose.Schema;
const TestCasesSchema = new Schema({
  Question:{
    type: mongoose.Types.ObjectId,
    ref: 'Question'
  },
  input: {
    type: Schema.Types.Mixed,
    required: true,
  },
  output: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("TestCase", TestCasesSchema);
