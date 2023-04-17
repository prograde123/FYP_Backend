var express = require("express");
var router = express.Router();
const Course = require("../models/course");
var mongoose = require("mongoose");

//create a new course
router.post("/addCourse", async function (req, res) {
  const course = new Course({
    teacher: req.body.teacherId,
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
router.get("/coursesList", async function (req, res) {
  try {
    const coursesList = await Course.find()
      .sort({ name: "desc" })
      .populate("teacher")
      .populate("courseContent")
      .populate("students");
    res.json({ courses: coursesList });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//view any specific course
router.get("/viewCourse/:cid", async function (req, res) {
  try {
    const course = await Course.findOne({ _id: req.params.cid })
      .populate("teacher")
      .populate("courseContent")
      .populate("students");
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//edit a specific course
router.patch("/updateCourse/:cid", async function (req, res) {
  try {
    const updatedCourse = await Course.updateOne(
      { _id: req.params.cid },
      {
        $set: {
          courseCode: req.body.courseCode,
          name: req.body.name,
          description: req.body.description,
          creditHours: req.body.creditHours,
          language: req.body.language,
          startingDate: req.body.startingDate,
          endingDate: req.body.endingDate,
          image: req.body.image,
        },
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
router.get("/viewCourseContent/:cid", async function (req, res) {
  try {
    const courseContent = await Course.findOne({ _id: req.params.cid });
    res.json(courseContent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//update any specific course content
router.patch("/updateCourseContent/:cid/:mid", async function (req, res) {
  try {
    const courseContentId = req.params.mid;
    const courseId = req.params.cid;
    const updateCourseContent = await Course.updateOne(
      { _id: courseId, "courseContent._id": courseContentId },
      {
        $push: {
          courseContent: {
            lecNo: req.body.lecNo,
            title: req.body.title,
            file: req.body.file,
          },
        },
      }
    );
    res.json(updateCourseContent);
  } catch (err) {
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

//add Student (accept student request)
router.put("/addStudent/:cid", async function (req, res) {
  try {
    const student = await Course.updateOne(
      { _id: req.params.cid },
      {
        $push: {
          students: {
            student: req.body.studentId,
          },
        },
      }
    );
    res.json(student);
  } catch (err) {
    res.send({ message: err });
  }
});

module.exports = router;
