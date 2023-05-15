var mongoose = require("mongoose");
var PlagiarismReportSchema = mongoose.Schema({
  file: {
    type: String,
    required: true,
  },
  percentage: {
    type: Number,
    required: true,
  },
  matches: {
    type: [
        {
          type: mongoose.Types.ObjectId,
          ref: "Match",
        },
      ],
  },
});

module.exports = mongoose.model("PlagairismReport", PlagiarismReportSchema);
