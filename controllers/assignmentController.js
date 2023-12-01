var User = require("../models/user");
var AsyncHandler = require("express-async-handler");
var generateToken = require("../Utills/generateToken");
var Teacher = require("../models/teacher");
var Assignment = require('../models/assignment');
var Course= require("../models/course");
var TestCase = require("../models/testCase")
const { Types } = require('mongoose');
const Question = require("../models/question");
const fs = require('fs');
const PDFDocument = require('pdfkit');
const question = require("../models/question");
const Submission = require('../models/submission');
const { ObjectId } = require('mongoose').Types;

const addAssignment = AsyncHandler(async (req, res, next) => {
  const { questions, assig } = req.body;
  const maxAssignment = await Assignment.findOne(
    { CourseID: assig.CourseID },
    { assignmentNumber: 1 }
  )
    .sort({ assignmentNumber: -1 })
    .limit(1);

  const newAssignmentNumber = maxAssignment
    ? maxAssignment.assignmentNumber + 1
    : 1;
  
  const dueTime = new Date(assig.dueTime);

  const data = {
    CourseID: assig.CourseID,
    assignmentNumber: newAssignmentNumber, 
    description: assig.description,
    uploadDate: new Date(),
    dueDate: new Date(assig.dueDate),
    dueTime: dueTime, 
    totalMarks: questions.reduce(
      (total, quest) => total + quest.questionTotalMarks,
      0
    ),
    format: assig.format,
    noOfQuestions: assig.noOfQuestions,
  };

  try {
    const assignment = await Assignment.create(data);
    await Promise.all(
      questions.map(async (quest) => {
        const question = await Question.create({
          Assignment: assignment._id,
          questionDescription: quest.questionDescription,
          questionTotalMarks: quest.questionTotalMarks,
          isInputArray: quest.isInputArray,
        });

        await Promise.all(
          quest.testCases.map(async (testCases) => {
            await TestCase.create({
              Question: question._id,
              ...testCases,
            });
          })
        );
      })
    );

    res.send({ success: true });
  } catch (error) {
    console.log("Error:", error);
    res.send({ success: false });
  }
});



const addQuestionInAssignment = AsyncHandler(async (req, res, next) => {
  const { newQuestion, assignemntID
  } = req.body;
  try {
    const assign = await Assignment.findById(assignemntID);
    const assignment = await Assignment.updateOne(
      {_id : assignemntID},
      {
        noOfQuestions : assign.noOfQuestions + 1
      }
    )
    const question = await Question.create({
        Assignment: assignemntID,
        questionDescription: newQuestion.questionDescription,
        questionTotalMarks: newQuestion.questionTotalMarks,
        isInputArray: newQuestion.isInputArray,
      });

      newQuestion.testCases.map(async (testCases) => {
        const testCase = await TestCase.create({
          Question: question._id,
          ...testCases,
        });
      });
    


    res.send({ success: true });
  } catch (error) {
    console.log("Error:", error);
    res.send({ success: false });
  }
});

const editAssignment = AsyncHandler(async(req,res,next)=>{
  
  const {assigId,assignmentNumber,description,dueDate,dueTime,format} = req.body;
  try{
  const assignment = await Assignment.updateOne(
    {_id : assigId},
    {
      assignmentNumber : assignmentNumber ,
      description : description ,
      dueDate : dueDate ,
      dueTime : dueTime ,
      format : format 
    }
  )
  console.log(assignment)
    
    res.json({ success: `Assignment successfully updated! ` });
  }
  catch(err) {
    res.send({ message: err });
  }
})


const editQuestion = AsyncHandler(async(req,res,next)=>{
  
  const {qId,questionDescription,questionTotalMarks,isInputArray} = req.body;
  try{
  const question = await Question.updateOne(
    {_id : qId},
    {
      questionDescription : questionDescription ,
      questionTotalMarks : questionTotalMarks ,
      isInputArray : isInputArray ,
    }
  )
  console.log(question)
    
    res.json({ success: `question successfully updated! ` });
  }
  catch(err) {
    res.send({ message: err });
  }
})


const editTestCase = async(req,res,next)=>{
  
  const {tcId,input,output,arraySize} = req.body;
  console.log(tcId)
  try{
  const TestCase = await TestCase.updateOne(
    {_id : tcId},
    {
      input : input ,
      output : output ,
      arraySize : arraySize
    }
  )
  console.log(TestCase)
    res.json({ success: `TestCase successfully updated! ` });
  }
  catch(err) {
    res.send({ message: err });
  }
}

const AddTestCaseInQuestion = async(req,res,next)=>{
  
  const {qid,input,output ,arraySize} = req.body;
  try{
    const testCase = await TestCase.create({
      Question: qid,
      input: input,
      output : output,
      arraySize : arraySize ? arraySize : null
    });

    console.log(testCase)
    
    res.json({ success: `TestCase successfully created! ` });
  }
  catch(err) {
    res.send({ message: err });
  }
}

const deleteAssignment = AsyncHandler(async (req, res, next) => {
  const assignmentid = req.params.aid;
  const courseid = req.params.cid;
  if (!Types.ObjectId.isValid(courseid) || !Types.ObjectId.isValid(assignmentid)) {
    res.status(400).json({ error: 'Invalid courseid or assignmentid' });
    return;
  }
  try {
    
    const deletedAssignment = await Assignment.findOneAndDelete({ _id: assignmentid });
    if (!deletedAssignment) {
      res.status(404).json({ error: 'Assignment not found' });
      return;
    }

    const relatedQuestions = await Question.find({ Assignment: assignmentid })
    await Question.deleteMany({ Assignment: assignmentid });
    const questionIds = relatedQuestions.map((question) => question._id);
    console.log(questionIds)
    await TestCase.deleteMany({ Question: { $in: questionIds } });

    res.status(200).json({ success: 'Assignment removed from course' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const deleteQuestion = AsyncHandler(async (req, res, next) => {
  const questionId = req.params.qid;
  if ( !Types.ObjectId.isValid(questionId)) {
    res.status(400).json({ error: 'Invalid questionID' });
    return;
  }
  try {
    
    await Question.findByIdAndDelete(questionId);
    await TestCase.deleteMany({ Question: { $in: questionId } });
    res.status(200).json({ success: 'question removed from course' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const deleteTestCases = AsyncHandler(async (req, res, next) => {
  const TestCaseId = req.params.tid;

  if ( !Types.ObjectId.isValid(TestCaseId)) {
    res.status(400).json({ error: 'Invalid TestcaseID' });
    return;
  }

  try {
    await TestCase.findByIdAndDelete(TestCaseId);
    res.status(200).json({ success: 'TestCase removed from Question' });
  }
  catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const viewSubmittedList = AsyncHandler(
    async(req,res,next)=>{
      const assignmentID = req.body
      const assignment = await Assignment.findById(assignmentID).populate({
        path:'submittedAssignment',
        model:'Submission',
        populate:{
          path:'student testResults plagairismReport',
          model:'Student TestResult PlagairismReport'
        }
      })
      res.status(200).json({
        submissions: assignment.submittedAssignment
      })
    }
  )

  const viewAssignmentList = AsyncHandler(
    async (req, res, next) => {
      try {
        const assignments = await Assignment.find({ CourseID: req.params.cid });
  
        const setAssignments = await Promise.all(
          assignments.map(async (a) => {
            const questions = await Question.find({ Assignment: a._id });
            const totalMarks = questions.reduce(
              (sum, question) => sum + question.questionTotalMarks,
              0
            );
  
            return {
              _id: a._id,
              CourseID: a.CourseID,
              assignmentNumber: a.assignmentNumber,
              description: a.description,
              uploadDate: a.uploadDate.toISOString().split('T')[0],
              dueDate: a.dueDate.toISOString().split('T')[0],
              dueTime: a.dueTime,
              totalMarks: totalMarks,
              format: a.format,
              noOfQuestions: a.noOfQuestions,
            };
          })
        );
  
        res.json({ assignments: setAssignments });
      } catch (error) {
        console.error(error);
      }
    }
  );
  
/*const viewAssignment = AsyncHandler(async (req, res, next) => {
  const assignmentId = req.params.aid;

  try {
    
    const assignment = await Assignment.findById(assignmentId);
    

    const questions = await question.find({Assignment : assignmentId})


    const testcasesWithQuestions = [];

    const getTestCases = async (question) => {
      const findTestCase = await TestCase.find({ Question: question._id });
      return findTestCase;
    };
    
    const updateTestCases = async () => {
      for (const question of questions) {
        const testCases = await getTestCases(question);
        const questionWithTestCases = {
          ...question,
          testCases: testCases,
        };
        testcasesWithQuestions.push(questionWithTestCases);
      }

    };
    
    updateTestCases();
    
    
   
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

   
    const pdfDoc = new PDFDocument();
    
    pdfDoc.font('Helvetica-Bold').fontSize(25).text(`Assignment Number : ${assignment.assignmentNumber}`, { align: 'center', bold: true });
    pdfDoc.fontSize(15).text(`Total Marks : ${assignment.totalMarks.toString()}`, { align: 'right', bold: true });
    for(let x = 0; x < questions.length; x++) {
    
      pdfDoc.fontSize(13).text(`Question : ${x+1}` , {
        underline: true
      });
        pdfDoc.fontSize(13).text(`  ${questions[x].questionDescription} `);
        pdfDoc.fontSize(11).text(`( ${questions[x].questionTotalMarks.toString() } ) ` , { align: 'right' });
    
    }

    const pdfBuffer = [];
    pdfDoc.on('data', (chunk) => pdfBuffer.push(chunk));
    pdfDoc.on('end', () => {
  
      const pdfDataUrl = Buffer.concat(pdfBuffer).toString('base64');

      console.log(testcasesWithQuestions)
      
      const jsonResponse = {
        Viewassignment: assignment,
        PdfDataUrl: `data:application/pdf;base64,${pdfDataUrl}`, 
        Viewquestions : questions,
        TestCase : testcasesWithQuestions

      };

      console.log(jsonResponse)


      res.status(200).json(jsonResponse);
    });
    pdfDoc.end();
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});*/
const viewAssignment = AsyncHandler(async (req, res, next) => {
  const assignmentId = req.params.aid;

  try {
    const assignment = await Assignment.findById(assignmentId);
    const questions = await question.find({ Assignment: assignmentId });

    const getTestCases = async (question) => {
      return await TestCase.find({ Question: question._id });
    };

    const testcasesWithQuestions = await Promise.all(
      questions.map(async (question) => {
        const testCases = await getTestCases(question);
        return { ...question, testCases };
      })
    );

    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    const pdfDoc = new PDFDocument();
    pdfDoc.font('Helvetica-Bold').fontSize(25).text(`Assignment Number : ${assignment.assignmentNumber}`, { align: 'center', bold: true });
    pdfDoc.fontSize(15).text(`Total Marks : ${assignment.totalMarks.toString()}`, { align: 'right', bold: true });

    for (let x = 0; x < questions.length; x++) {
      pdfDoc.fontSize(13).text(`Question : ${x + 1}`, {
        underline: true,
      });
      pdfDoc.fontSize(13).text(`  ${questions[x].questionDescription} `);
      pdfDoc.fontSize(11).text(`( ${questions[x].questionTotalMarks.toString() } ) `, { align: 'right' });
    }

    const pdfBuffer = [];
    pdfDoc.on('data', (chunk) => pdfBuffer.push(chunk));
    pdfDoc.on('end', () => {
      const pdfDataUrl = Buffer.concat(pdfBuffer).toString('base64');


     
      const jsonResponse = {
        Viewassignment: assignment,
        PdfDataUrl: `data:application/pdf;base64,${pdfDataUrl}`,
        Viewquestions: questions,
        TestCase: testcasesWithQuestions,
      };

      res.status(200).json(jsonResponse);
    });
    pdfDoc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});



const getStudentsByAssignmentId = async (req, res) => {
  try {
    const assignmentId = req.params.aid;

    const questionIds = await Question.find({ Assignment: assignmentId }).select('_id');

    const submissions = await Submission.find({ question: { $in: questionIds } });

    const studentInfoMap = new Map();

    submissions.forEach((submission) => {
      const studentId = submission.student.toString();
      const studentName = ''; 
      studentInfoMap.set(studentId, studentName);
    });

    const studentInfoArray = Array.from(studentInfoMap, ([id, name]) => ({ id, name }));

    const uniqueStudentIds = Array.from(studentInfoMap.keys());
    const userNames = await User.find({ _id: { $in: uniqueStudentIds } }).select('_id fullName');

    userNames.forEach((user) => {
      const studentId = user._id.toString();
      const studentName = user.fullName;
      studentInfoMap.set(studentId, studentName);
    });

    const finalStudentInfoArray = Array.from(studentInfoMap, ([id, name]) => ({ id, name }));
    console.log(finalStudentInfoArray)
    res.json({ studentInfo: finalStudentInfoArray });
  } catch (error) {
    console.error("Error fetching student info:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


module.exports = {
  viewAssignment,
  deleteAssignment,
  addAssignment,
  editAssignment,
  viewAssignmentList,
  viewSubmittedList,
  editQuestion,
  editTestCase,
  addQuestionInAssignment,
  AddTestCaseInQuestion,
  deleteQuestion,
  deleteTestCases,
  getStudentsByAssignmentId
}