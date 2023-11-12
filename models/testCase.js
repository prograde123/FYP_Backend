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
  arraySize:{
    type: Schema.Types.Mixed,
  }
});


module.exports = mongoose.model("TestCase", TestCasesSchema);
