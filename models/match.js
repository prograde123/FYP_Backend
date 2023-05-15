var mongoose = require("mongoose");
const MatchSchema = new Schema({
  source: {
    type: String,
    required: true,
  },
  lineStart: {
    type: Number,
    required: true,
  },
  lineEnd: {
    type: Number,
    required: true,
  },
  percentage: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Match", MatchSchema);
