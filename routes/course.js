var express = require("express");
var router = express.Router();
const Course = require("../models/course");
const Assignment = require("../models/assignment");
var mongoose = require("mongoose");

//create a new course
router.post("/addCourse", async function (req, res) {
  const course = new Course({
    teacher: mongoose.Types.ObjectId(req.body.teacher),
    courseCode: req.body.courseCode,
    name: req.body.name,
    description: req.body.description,
    creditHours: req.body.creditHours,
    language: req.body.language,
    startingDate: req.body.startingDate,
    endingDate: req.body.endingDate,
    image: req.body.image,
    courseContent: [],
    students: [],
    requests: [],
    assignments: [],
  });
  try {
    const newCourse = await course.save();
    res.json({ success: newCourse });
  } catch (err) {
    console.log(err);
    res.json({ error: "AN error occured" });
  }
});

//view courses list
router.get("/coursesList/:tid", async function (req, res) {
  try {
    const coursesList = await Course.find({ teacher: req.params.tid })
      .sort({ name: "desc" })
      .populate({
        path: "teacher",
        populate: {
          path: "user",
        },
      })
      .populate("courseContent")
      .populate("students")
      .populate("requests")
      .populate("assignments");
    res.json({ courses: coursesList });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

//view any specific course
router.get("/viewCourse/:cid", async function (req, res) {
  try {
    const course = await Course.findOne({ _id: req.params.cid })
      .populate("teacher")
      .populate("courseContent")
      .populate("students")
      .populate("requests")
      .populate("assignments");

    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//edit a specific course
router.patch("/updateCourse/:cid", async function (req, res) {
  try {
    console.log(req.body);
    const updatedCourse = await Course.updateOne(
      { _id: req.params.cid },
      {
        courseCode: req.body.courseCode,
        name: req.body.name,
        description: req.body.description,
        creditHours: req.body.creditHours,
        language: req.body.language,
        startingDate: req.body.startingDate,
        endingDate: req.body.endingDate,
        image: req.body.image,
      }
    );
    res.json(updatedCourse);
  } catch (err) {
    res.send({ message: err });
  }
});

//delete a specific course
router.delete("/deleteCourse/:cid", function (req, res) {
  try {
    Course.findByIdAndRemove(req.params.cid, (err) => {
      res.json({ success: req.params.cid });
    });
  } catch (err) {
    console.log(err);
    res.json({ err: "AN error occured" });
  }
});

//add course content
router.put("/addCourseContent/:cid", async function (req, res) {
  try {
    const courseContent = await Course.updateOne(
      { _id: req.params.cid },
      {
        $push: {
          courseContent: {
            lecNo: req.body.lecNo,
            title: req.body.title,
            fileType: req.body.fileType,
            file: req.body.file,
            uploadedDate: req.body.uploadedDate,
          },
        },
      }
    );
    res.json(courseContent);
  } catch (err) {
    res.send({ message: err });
  }
});

//view course content list
router.get("/viewCourseContentList/:cid", async function (req, res) {
  try {
    const courseContent = await Course.findOne({
      _id: req.params.cid,
    }).populate("courseContent");
    console.log(courseContent);
    res.json({ courseContent: courseContent.courseContent });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//update any specific course content
router.patch("/updateCourseContent/:cid/:mid", async function (req, res) {
  try {
    const courseContentId = req.params.mid;
    const courseId = req.params.cid;
    const course = await Course.findOne({
      _id: courseId,
      "courseContent._id": courseContentId,
    });
    const material = course.courseContent.id(courseContentId);
    material["lecNo"] = req.body.lecNo;
    material["title"] = req.body.title;
    material["fileType"] = req.body.fileType;
    material["file"] = req.body.file;

    await course.save();
    res.json({ course: course });
  } catch (err) {
    console.log(err);
    res.send({ message: err });
  }
});

//delete any specific course content
router.delete("/deleteCourseContent/:cid/:mid", async function (req, res) {
  try {
    const courseContentId = req.params.mid;
    const courseId = req.params.cid;
    const deleteCourseContent = await Course.updateOne(
      { _id: courseId },
      {
        $pull: {
          courseContent: {
            _id: courseContentId,
          },
        },
      }
    );
    res.json(deleteCourseContent);
  } catch (err) {
    res.send({ message: err });
  }
});

//teacher accepts student enrollment request
router.put("/acceptRequest/:cid/:sid", async function (req, res) {
  try {
    const studentId = req.params.sid;
    const courseId = req.params.cid;
    const addStudent = await Course.updateOne(
      { _id: courseId },
      {
        $pull: {
          requests: studentId,
        },
        $push: {
          students: mongoose.Types.ObjectId(studentId),
        },
      }
    );
    res.json(addStudent);
  } catch (err) {
    res.send({ message: err });
  }
});

//decline request of student enrollment
router.put("/declineRequest/:cid/:sid", async function (req, res) {
  try {
    const studentId = req.params.sid;
    const courseId = req.params.cid;
    const addStudent = await Course.updateOne(
      { _id: courseId },
      {
        $pull: {
          requests: studentId,
        },
      }
    );
    res.json(addStudent);
  } catch (err) {
    res.send({ message: err });
  }
});

//View all enrollment requests
router.get("/viewRequests/:cid", async function (req, res) {
  try {
    const enrollmentRequests = await Course.findOne({
      _id: req.params.cid,
    }).populate("requests");
    res.json(enrollmentRequests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//student sending request to teacher
router.put("/sendRequest/:cid/:sid", async function (req, res) {
  try {
    const studentId = req.params.sid;
    const courseId = req.params.cid;
    const enrollment = await Course.updateOne(
      { _id: courseId },
      {
        $push: { requests: mongoose.Types.ObjectId(studentId) },
      }
    );
    res.json(enrollment);
  } catch (err) {
    res.send({ message: err });
  }
});

//view enrolled student of specific course
router.get("/viewAllStudents/:cid", async function (req, res) {
  try {
    const enrollmentRequests = await Course.findOne({
      _id: req.params.cid,
    }).populate("students");
    res.json(enrollmentRequests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//remove enrolled student from any specific course
router.put("/removeStudent/:cid/:sid", async function (req, res) {
  try {
    const studentId = req.params.sid;
    const courseId = req.params.cid;
    const delStudent = await Course.updateOne(
      { _id: courseId },
      {
        $pull: {
          students: studentId,
        },
      }
    );
    res.json(delStudent);
  } catch (err) {
    res.send({ message: err });
  }
});

//download course contents

module.exports = router;
