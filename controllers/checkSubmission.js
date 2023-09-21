var User = require("../models/user");
var AsyncHandler = require("express-async-handler");
var generateToken = require("../Utills/generateToken");
var Teacher = require("../models/teacher");
const student = require("../models/student");
const submission = require("../models/submission");
const question = require("../models/question");
const testResult = require("../models/testResult");

const Submission = AsyncHandler(async (req, res, next) => {
    const student = req.user._id;
  
    try {
      const getSubmission = await submission.find({ student: student });
      if (getSubmission.length > 0) {
        res.json({ success: true });
      } else {
        res.json({ success: false });
      }
    } catch (error) {
      console.error("Error fetching submissions:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  const getSubmission = AsyncHandler(async (req, res, next) => {
    const student = req.user._id;
  
    try {
      const { assignmentId } = req.query;
      const questions = await question.find({
        Assignment: assignmentId,
      });
  
      const questionIds = questions.map((q) => q._id);
  
      const submissions = await submission.find({
        student: student,
        question: { $in: questionIds },
      });
  
     
      const formattedResponse = [];
  
      for (const submission of submissions) {
        const questionData = questions.find((q) => q._id.equals(submission.question));
  
        const testResults = await testResult.find({
          _id: { $in: submission.testResults },
        });
  
        const submissionData = {
          questionDescription: questionData.questionDescription,
          testResults: testResults,
        };
  
        formattedResponse.push(submissionData);
      }
  
      res.json({ formattedResponse });
    } catch (error) {
      console.error("Error fetching submissions:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  
  

module.exports = {
  Submission,
  getSubmission
};
