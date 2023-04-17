var mongoose = require("mongoose");
var Teacher = require("./teacher");
var Student = require("./student");
var CourseSchema = mongoose.Schema({
  teacher: {
    type: mongoose.Types.ObjectId,
    ref: 'Teacher'
  },
  courseCode: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  creditHours: {
    type: Number
  },
  language: {
    type: String,
    required: true
  },
  startingDate: {
    type: Date,
    required: true,
    default: Date.now()
  },
  endingDate: {
    type: Date,
    required: true
  },
  image: {
    type: Buffer
  },
  courseContent: {
    type: [
      {
        lecNo: {
          type: Number,
          required: true
        },
        title: {
          type: String,
          required: true,
        },
        file: {
          type: Buffer,
        },
        uploadedDate: {
          type: Date,
        },
      },
    ],
  },
  students: {
    type: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Student",
      }
    ]
  }
})
module.exports = mongoose.model("Course", CourseSchema);