var User = require("../models/user");
var AsyncHandler = require("express-async-handler");
var generateToken = require("../Utills/generateToken");
var Teacher = require("../models/teacher");
var Assignment = require('../models/assignment');
var Course= require("../models/course");
var TestCase = require("../models/testCase")
var PlagairismReport = require("../models/plagairismReport")
const { Types } = require('mongoose');
const Question = require("../models/question");
const fs = require('fs');
const PDFDocument = require('pdfkit');
const Resubmission = require("../models/resubmit");
const Submission = require('../models/submission');
const { ObjectId } = require('mongoose').Types;

const DoesStudentAlreadyCheck = AsyncHandler(async (req, res, next) => {
    
    const Aid = req.params.aid;
  
    try {
      const plagiarismReport = await PlagairismReport.findOne({
        User: req.user._id,
        Assignment: Aid,
      });
  
      if (plagiarismReport) {
        res.status(200).json({ success: true, message: plagiarismReport });
      } else {
        res.status(200).json({ success: false, message: null });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  });
  
/*const updateSubmissionss= AsyncHandler(async (req, res, next) => {
    
    const Qid = req.params.qid;

    const { plag } = req.body
  
    try {
      const getSubmission = await Submission.findOne({
        student: req.user._id,
        question: Qid,
      });
  
      if (getSubmission) {
       
      } else {
       
      }
    } catch (error) {
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  });*/
  
  const updateSubmissions = AsyncHandler(async (req, res, next) => {
    const Qid = req.params.qid;
    const { plag } = req.body;
  
    try {
      const getSubmission = await Submission.findOne({
        student: req.user._id,
        question: Qid,
      });
  
      const getResubmission = await Resubmission.findOne({
        student: req.user._id,
        question: Qid,
      });
  
      if (getSubmission || getResubmission) {
        if (getSubmission && getSubmission.obtainedMarks !== 0) {
          updateObtainedMarks(getSubmission, plag);
        }
  
        if (getResubmission && getResubmission.obtainedMarks !== 0) {
          updateObtainedMarks(getResubmission, plag);
        }
  
        res.status(200).json({ success: true, message: "Obtained marks updated successfully" });
      } else {
        res.status(404).json({ success: false, message: "Submission not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  });
  
  const updateObtainedMarks = async (submission, plag) => {
    let updatedObtainedMarks;
    if (plag < 50) {
      updatedObtainedMarks = Math.round(submission.obtainedMarks - (0.25 * plag * submission.obtainedMarks) / 100, 2);
    } else {
      updatedObtainedMarks = Math.round(submission.obtainedMarks - (0.75 * plag * submission.obtainedMarks) / 100, 2);
    }
  
    submission.obtainedMarks = updatedObtainedMarks;
    await submission.save();
  };
  

  const makePlagReport = AsyncHandler(async (req, res, next) => {
    
    const {   aid , Overall_PlagiarismPercentage ,Checked_With_No_Of_Submissions
    } = req.body;
  
    try {
      const createReport = await PlagairismReport.create({
        Assignment: aid,
        User: req.user._id,
        Overall_PlagiarismPercentage: Math.round(Overall_PlagiarismPercentage,4),
        Checked_With_No_Of_Submissions : Checked_With_No_Of_Submissions
      });
  
      if (createReport) {
        res.status(200).json({ success: true, message: "Report created" });
      } else {
        res.status(404).json({ success: false, message: "Submission not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  });


  const getReports = AsyncHandler(async (req, res, next) => {
    const Aid = req.params.aid;
  
    try {
      const plagiarismReports = await PlagairismReport.find({
        Assignment: Aid,
      }).populate('User', 'fullName email');
  
      if (plagiarismReports.length > 0) {
        const reportsWithUserDetails = plagiarismReports.map((report) => {
          const { User, ...rest } = report.toObject();
          const userDetails = User
            ? { userId: User._id, fullName: User.fullName, email: User.email }
            : null;
          return { ...rest, ...userDetails };
        });
          console.log(reportsWithUserDetails)
        res.status(200).json({ success: true, PlagiarismReports: reportsWithUserDetails });
      } else {
        res.status(200).json({ success: false, PlagiarismReports: null });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  });
  
  
  


  module.exports = {
    DoesStudentAlreadyCheck,
    updateSubmissions,
    makePlagReport,
    getReports
  }