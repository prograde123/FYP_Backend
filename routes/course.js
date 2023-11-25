var express = require("express");
var router = express.Router();
const Course = require("../models/course");
const User = require("../models/user")
const Student = require("../models/student")
const Assignment = require("../models/assignment")
const Teacher = require("../models/teacher")
const Submission = require("../models/submission")
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

//View all enrollment requests of any specific course
router.get("/viewRequests/:cid", async function (req, res) {
  try {
    const enrollmentRequests = await Course.findOne({
      _id: req.params.cid,
    }).populate("requests");
    console.log(enrollmentRequests);
    res.json({ requests: enrollmentRequests.requests });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//View enrollement request of all courses
router.get("/viewAllRequests", async function (req, res) {
  try {
    const enrollmentRequests = await Course.find().populate("requests");
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










// STUDENT ROUTES

//view all available courses for enrollement
router.get("/ViewAllAvailableCourses/:studentId", async function (req, res) {
  try {
    const studentId = req.params.studentId;

    // Find the student by ID
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Find courses where the student's ObjectId is not in the 'students' array
    const availableCourses = await Course.find({
      "students": { $nin: [student._id] },
      "requests": { $nin: [student._id] }
    })
      .sort({ name: "desc" })
      .populate({
        path: "teacher",
        populate: {
          path: "user",
        },
      })
      .populate("courseContent")
      .populate("students");

    res.json({ courses: availableCourses });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});


//view student courses list
router.get("/studentCoursesList/:sid", async function (req, res) {
  try {
    const coursesList = await Course.find({ students: req.params.sid })
      .populate({
        path: "students",
        populate: {
          path: "user",
        },
      })
      .populate("courseContent")
      .populate("students")
      .populate({
        path: "teacher",
        populate: {
          path: "user",
        },
      })
    res.json({ courses: coursesList });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

router.get("/CourseDetails/:cid", async function (req, res) {
  try {
    const course = await Course.findOne({ _id: req.params.cid })
      .populate({
        path: "teacher",
        populate: {
          path: "user",
        },
      })
      .populate("courseContent")
      .populate("students")

    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/generateSimpleInputs", async (req, res) => {

  function generateRandomString(length) {
  const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const maxCharIndex = characters.length - 1;
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * (maxCharIndex + 1));
    result += characters.charAt(randomIndex);
  }
  return result;
}

  function generateTestCases(numInputs, numTestCases, startRange, endRange, dataType) {
    const testCases = [];
    for (let i = 0; i < numTestCases; i++) {
      const testCase = [];
      for (let j = 0; j < numInputs; j++) {
        let randomValue;
        if (dataType === "int") {
          randomValue = Math.floor(Math.random() * (endRange - startRange + 1)) + startRange;
        } 
        
        else if (dataType === "float") {
          randomValue = parseFloat((Math.random() * (endRange - startRange) + startRange).toFixed(3));
        } 
        
        else if (dataType === "string") {
         const stringLength = Math.floor(Math.random() * (endRange - startRange + 1)) + startRange;
         randomValue = generateRandomString(stringLength);
        }
        
        testCase.push(randomValue);
      }

      const testCaseString = testCase.join(',');
      testCases.push(testCaseString);
    }
    return testCases;
  }

  //to save the inputs genearted to db
  const { numInputs, numTestCases, startRange, endRange, dataType } = req.body;
  try {
    const generatedTestCases = generateTestCases(numInputs, numTestCases, startRange, endRange, dataType);
    res.status(200).json(generatedTestCases);
  } catch (error) {
    console.error("Error generating test cases:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/generateArrayInputs", async (req, res) => {

  function generateRandomString(length) {
  const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const maxCharIndex = characters.length - 1;
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * (maxCharIndex + 1));
    result += characters.charAt(randomIndex);
  }
  return result;
}

  function generateTestCases(arraySize, numTestCases, startRange, endRange, dataType) {
    const testCases = [];
    for (let i = 0; i < numTestCases; i++) {
      const testCase = [];
      for (let j = 0; j < arraySize; j++) {
        let randomValue;
        
        if (dataType === "int") {
          randomValue = Math.floor(Math.random() * (endRange - startRange + 1)) + startRange;
        } 
        
        else if (dataType === "float") {
          randomValue = parseFloat((Math.random() * (endRange - startRange) + startRange).toFixed(3));
        } 
        
        else if (dataType === "string") {
          const stringLength = Math.floor(Math.random() * (endRange - startRange + 1)) + startRange;
          randomValue = generateRandomString(stringLength);
        }
        
        testCase.push(randomValue);
      }

      testCases.push(testCase);
    }
    return JSON.stringify(testCases);
  }

  const { arraySize, numTestCases, startRange, endRange, dataType } = req.body;
  try {
    const generatedTestCases = generateTestCases(arraySize, numTestCases, startRange, endRange, dataType);
    res.status(200).send(generatedTestCases);
  } catch (error) {
    console.error("Error generating test cases:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get('/assignmentsCount', async (req, res) => {
  try {
    const counts = await Promise.all([
      Assignment.countDocuments(),
      Course.countDocuments(),
      Submission.countDocuments(),
      Teacher.countDocuments(),
      Student.countDocuments(),
    ]);

    const [assignmentsCount, coursesCount, submissionsCount, teachersCount, studentsCount] = counts;
    
    res.json({
      assignmentsCount,
      coursesCount,
      submissionsCount,
      teachersCount,
      studentsCount,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/coursesCountByMonth', async (req, res) => {
  try {
    const coursesByMonth = await Course.aggregate([
      {
        $group: {
          _id: {
            month: { $month: '$startingDate' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          month: '$_id.month',
          count: 1
        }
      },
      {
        $sort: {
          month: 1
        }
      }
    ]);

    const countsMap = new Map(coursesByMonth.map(item => [item.month, item.count]));
    const finalCounts = [];
    for (let i = 1; i <= 12; i++) {
      finalCounts.push({ month: i, count: countsMap.get(i) || 0 });
    }

    res.json(finalCounts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;