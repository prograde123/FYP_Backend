var express = require("express");
var router = express.Router();
const Course = require("../models/course");
const User = require("../models/user");
const Student = require("../models/student");
const Assignment = require("../models/assignment");
const Teacher = require("../models/teacher");
const Submission = require("../models/submission");
const Question = require("../models/question");
var mongoose = require("mongoose");
const PDFDocument = require("pdfkit");
const PlagiarismReport = require("../models/plagairismReport");

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
      .populate("requests");
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
      .populate("requests");

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
      students: { $nin: [student._id] },
      requests: { $nin: [student._id] },
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
      });
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
      .populate("students");

    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/generateSimpleInputs", async (req, res) => {
  function generateRandomString(length) {
    const characters =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const maxCharIndex = characters.length - 1;
    let result = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * (maxCharIndex + 1));
      result += characters.charAt(randomIndex);
    }
    return result;
  }

  function generateTestCases(
    numInputs,
    numTestCases,
    startRange,
    endRange,
    dataType
  ) {
    const testCases = [];
    for (let i = 0; i < numTestCases; i++) {
      const testCase = [];
      for (let j = 0; j < numInputs; j++) {
        let randomValue;
        if (dataType === "int") {
          randomValue =
            Math.floor(Math.random() * (endRange - startRange + 1)) +
            startRange;
        } else if (dataType === "float") {
          randomValue = parseFloat(
            (Math.random() * (endRange - startRange) + startRange).toFixed(3)
          );
        } else if (dataType === "string") {
          const stringLength =
            Math.floor(Math.random() * (endRange - startRange + 1)) +
            startRange;
          randomValue = generateRandomString(stringLength);
        }

        testCase.push(randomValue);
      }

      const testCaseString = testCase.join(",");
      testCases.push(testCaseString);
    }
    return testCases;
  }

  //to save the inputs genearted to db
  const { numInputs, numTestCases, startRange, endRange, dataType } = req.body;
  try {
    const generatedTestCases = generateTestCases(
      numInputs,
      numTestCases,
      startRange,
      endRange,
      dataType
    );
    res.status(200).json(generatedTestCases);
  } catch (error) {
    console.error("Error generating test cases:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/generateArrayInputs", async (req, res) => {
  function generateRandomString(length) {
    const characters =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const maxCharIndex = characters.length - 1;
    let result = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * (maxCharIndex + 1));
      result += characters.charAt(randomIndex);
    }
    return result;
  }

  function generateTestCases(
    arraySize,
    numTestCases,
    startRange,
    endRange,
    dataType
  ) {
    const testCases = [];
    for (let i = 0; i < numTestCases; i++) {
      const testCase = [];
      for (let j = 0; j < arraySize; j++) {
        let randomValue;

        if (dataType === "int") {
          randomValue =
            Math.floor(Math.random() * (endRange - startRange + 1)) +
            startRange;
        } else if (dataType === "float") {
          randomValue = parseFloat(
            (Math.random() * (endRange - startRange) + startRange).toFixed(3)
          );
        } else if (dataType === "string") {
          const stringLength =
            Math.floor(Math.random() * (endRange - startRange + 1)) +
            startRange;
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
    const generatedTestCases = generateTestCases(
      arraySize,
      numTestCases,
      startRange,
      endRange,
      dataType
    );
    res.status(200).send(generatedTestCases);
  } catch (error) {
    console.error("Error generating test cases:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/assignmentsCount", async (req, res) => {
  try {
    const counts = await Promise.all([
      Assignment.countDocuments(),
      Course.countDocuments(),
      Submission.countDocuments(),
      Teacher.countDocuments(),
      Student.countDocuments(),
    ]);

    const [
      assignmentsCount,
      coursesCount,
      submissionsCount,
      teachersCount,
      studentsCount,
    ] = counts;

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

router.get("/coursesCountByMonth", async (req, res) => {
  try {
    const coursesByMonth = await Course.aggregate([
      {
        $group: {
          _id: {
            month: { $month: "$startingDate" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          month: "$_id.month",
          count: 1,
        },
      },
      {
        $sort: {
          month: 1,
        },
      },
    ]);

    const countsMap = new Map(
      coursesByMonth.map((item) => [item.month, item.count])
    );
    const finalCounts = [];
    for (let i = 1; i <= 12; i++) {
      finalCounts.push({ month: i, count: countsMap.get(i) || 0 });
    }

    res.json(finalCounts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//REPORTS MODULE ROUTES

//report for class grade
router.get("/report/:assignmentId", async (req, res) => {
  try {
    const assignmentId = req.params.assignmentId;

    const assignment = await Assignment.findById(assignmentId);

    if (!assignment) {
      return res.status(404).send("Assignment not found");
    }

    const questions = await Question.find({ Assignment: assignmentId });

    if (questions.length === 0) {
      return res.status(404).send("No questions found for this assignment");
    }

    const submissions = await Submission.find({
      question: { $in: questions.map((q) => q._id) },
    });
    const studentIds = [
      ...new Set(submissions.map((submission) => submission.student)),
    ];

    const studentNames = await Student.find({ userID: { $in: studentIds } });

    const studentMap = new Map(
      studentNames.map((student) => [
        student.userID.toString(),
        student.userName,
      ])
    );

    const totalAssignmentMarks = questions.reduce(
      (total, question) => total + question.questionTotalMarks,
      0
    );

    const studentTotals = [];

    submissions.forEach((submission) => {
      const studentId = submission.student;
      const name = studentMap.get(studentId.toString());
      const obtainedMarks = submission.obtainedMarks;

      const submissionKey = `${studentId}_${submission.assignment}`; // Unique key for a student's submission in an assignment

      if (!studentTotals.find((student) => student.key === submissionKey)) {
        studentTotals.push({
          key: submissionKey,
          studentId,
          name,
          obtainedMarks: 0,
        });
      }

      const index = studentTotals.findIndex(
        (student) => student.key === submissionKey
      );
      studentTotals[index].obtainedMarks += obtainedMarks;
    });

    const doc = new PDFDocument();
    const fileName = `Assignment_${assignmentId}_Report.pdf`;

    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);

    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .text(
        `Class Grade Report for Assignment - ${assignment.assignmentNumber}`,
        { align: "center" }
      );
    doc.translate(0, 30);

    doc.text(`Total Assignment Marks: ${totalAssignmentMarks}`);
    doc.translate(0, 80);

    doc
      .font("Helvetica-Bold")
      .text("Student Name", 100, 50)
      .text("Obtained Marks", 300, 50)
      .text("Grade", 450, 50);
    doc.moveDown();

    let currentHeight = 100;

    studentTotals.forEach((student) => {
      const { name, obtainedMarks } = student;

      const percentage = (obtainedMarks / totalAssignmentMarks) * 100;
      let grade = "";

      if (percentage >= 90) {
        grade = "A";
      } else if (percentage >= 80) {
        grade = "B";
      } else if (percentage >= 70) {
        grade = "B+";
      } else if (percentage >= 60) {
        grade = "C";
      } else if (percentage >= 55) {
        grade = "C+";
      } else if (percentage >= 50) {
        grade = "D";
      } else if (percentage < 50) {
        grade = "F";
      }

      doc
        .font("Helvetica")
        .text(name, 100, currentHeight)
        .text(`${obtainedMarks}`, 330, currentHeight)
        .text(grade, 460, currentHeight);

      currentHeight += 30;
    });

    doc.end();
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

//finding courses of teacher for report
router.get("/courses/:teacherId", async (req, res) => {
  try {
    const teacherId = req.params.teacherId;
    const courses = await Course.find({ teacher: teacherId }).select(
      "name _id"
    ); // Adjust fields as needed

    res.json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

//finding assignment of the selected course
router.get("/assignments/:courseId", async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const assignments = await Assignment.find({ CourseID: courseId }).select(
      "assignmentNumber _id"
    ); // Adjust fields as needed

    res.json(assignments);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

//report for individual student
router.get("/studentReport/:studentId", async (req, res) => {
  const studentId = req.params.studentId;

  try {
    // Find the student
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Find all submissions of the student
    const submissions = await Submission.find({ student: studentId }).populate(
      "question"
    );

    // Prepare PDF document
    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${student.userName}_report.pdf"`
    );

    doc.pipe(res);

    // Add course title
    doc
      .fontSize(18)
      .text("Student Course Report", { align: "center" })
      .moveDown();

    // Add student's username
    doc
      .fontSize(14)
      .text(`Student: ${student.userName}`, { align: "left" })
      .moveDown();

    // Translate to add space
    doc.translate(0, 30);

    // Add table headers
    doc.font("Helvetica-Bold");
    doc
      .text("Assignment Number", 50, 120)
      .moveUp()
      .text("Questions", 200, 120)
      .moveUp()
      .text("Total Marks", 290, 120)
      .moveUp()
      .text("Obtained Marks", 380, 120)
      .moveUp()
      .text("Grade", 490, 120);
    doc.font("Helvetica");

    // Calculate total marks and obtained marks
    let totalObtainedMarks = 0;
    let totalMaxMarks = 0;
    let posY = 170; // Initial Y position for table content

    for (const submission of submissions) {
      const question = submission.question;
      const assignment = await Assignment.findOne({ _id: question.Assignment });

      if (!assignment) {
        continue; // Skip this submission if the associated assignment is not found
      }

      // Calculate total marks for the assignment based on its questions
      const assignmentQuestions = await Question.find({
        Assignment: assignment._id,
      });
      const assignmentTotalMarks = assignmentQuestions.reduce(
        (total, q) => total + q.questionTotalMarks,
        0
      );

      totalMaxMarks += assignmentTotalMarks;
      totalObtainedMarks += submission.obtainedMarks;

      // Display assignment details in columns
      doc
        .text(`${assignment.assignmentNumber}`, 100, posY)
        .text(`${assignmentQuestions.length}`, 220, posY)
        .text(`${assignmentTotalMarks}`, 310, posY)
        .text(`${submission.obtainedMarks}`, 410, posY);

      // Calculate grade
      const percentage =
        (submission.obtainedMarks / assignmentTotalMarks) * 100;
      let grade = "";

      if (percentage >= 90) {
        grade = "A";
      } else if (percentage >= 80) {
        grade = "B";
      } else if (percentage >= 70) {
        grade = "B+";
      } else if (percentage >= 60) {
        grade = "C";
      } else if (percentage >= 55) {
        grade = "C+";
      } else if (percentage >= 50) {
        grade = "D";
      } else if (percentage < 50) {
        grade = "F";
      }

      doc.text(grade, 500, posY);
      posY += 50; // Increment Y position for the next row
    }

    // Calculate overall percentage
    const overallPercentage = (totalObtainedMarks / totalMaxMarks) * 100;

    // Add overall percentage to the report
    doc
      .moveDown()
      .text(`Overall Percentage: ${overallPercentage.toFixed(2)}%`, {
        align: "center",
      });

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

//finding students in a course for report
router.get("/Students/:courseId", async function (req, res) {
  const courseId = req.params.courseId;
  try {
    const course = await Course.findById(courseId).populate("students");
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    const students = course.students;

    if (!students || students.length === 0) {
      return res
        .status(404)
        .json({ message: "No students found in this course" });
    }
    res.status(200).json({ students });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/download-report/:assignmentId", async (req, res) => {
  try {
    const assignmentId = req.params.assignmentId;

    // Fetch assignment details
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    // Fetch plagiarism reports for the assignment
    const plagiarismReports = await PlagiarismReport.find({
      Assignment: assignmentId,
    }).populate("User");

    // Create a new PDF document
    const doc = new PDFDocument();
    doc.pipe(res); // Stream the PDF directly to the response

    // Set PDF document properties
    doc.font("Helvetica-Bold");
    doc.fontSize(12).text("Plagiarism Report", { align: "center" }).moveDown();

    // Set up table headers
    doc.font("Helvetica-Bold");
    doc
      .text("Name", 50)
      .moveUp()
      .text("Email", 150)
      .moveUp()
      .text("Checked With Students", 300)
      .moveUp()
      .text("Plagiarism Percentage", 450);
    doc.moveDown();

    // Populate table with data
    doc.font("Helvetica");
    plagiarismReports.forEach((report) => {
      const user = report.User;
      doc
        .text(user.fullName, 50)
        .moveUp()
        .text(user.email, 150)
        .moveUp()
        .text(report.Checked_With_No_Of_Submissions, 350)
        .moveUp()
        .text(report.Overall_PlagiarismPercentage, 450);
      doc.moveDown();
    });

    // Finalize and close the PDF
    doc.end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get(
  "/downloadPlagiarismReport/:userId/:assignmentId",
  async (req, res) => {
    try {
      const { userId, assignmentId } = req.params;

      // Fetch the user details
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Fetch the plagiarism report for the user and assignment
      const report = await PlagiarismReport.findOne({
        User: userId,
        Assignment: assignmentId,
      }).populate("User");

      if (!report) {
        return res.status(404).json({ error: "Plagiarism report not found" });
      }

      // Create a PDF document
      const doc = new PDFDocument();
      const fileName = `${user.fullName}_Plagiarism_Report.pdf`;

      // Pipe the PDF to the response for download
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${fileName}"`
      );
      doc.pipe(res);

      // Add content to the PDF
      doc.fontSize(12);
      doc.text("Plagiarism Report", { align: "center" });
      doc.moveDown(); // Add a line space

      doc.text(`Name: ${user.fullName}`);
      doc.moveDown(); // Add a line space

      doc.text(`Email: ${user.email}`);
      doc.moveDown(); // Add a line space

      doc.text(
        `Checked With Students: ${report.Checked_With_No_Of_Submissions}`
      );
      doc.moveDown(); // Add a line space

      doc.text(
        `Plagiarism Percentage: ${report.Overall_PlagiarismPercentage}%`
      );
      doc.moveDown();

      // Finalize the PDF
      doc.end();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

module.exports = router;
