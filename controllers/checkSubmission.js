var User = require("../models/user");
var AsyncHandler = require("express-async-handler");
var generateToken = require("../Utills/generateToken");
var Teacher = require("../models/teacher");
const student = require("../models/student");
const submission = require("../models/submission");
const question = require("../models/question");
const testResult = require("../models/testResult");
const assignment = require("../models/assignment");
const testCase = require("../models/testCase");
const resubmit = require("../models/resubmit");
function shouldHideContent(testResult) {
  return Math.random() < 0.5;
}
const Submission = AsyncHandler(async (req, res, next) => {
  const student = req.user._id;
  const assignmentId = req.params.aid;

  try {
    const getquestions = await question.find({ Assignment: assignmentId });
    
    const promises = getquestions.map(async (ques) => {
      const getSubmission = await submission.find({ student: student, question: ques._id });
      console.log(getSubmission)
      return getSubmission.length > 0;
    });

    const results = await Promise.all(promises);
    
    const submitted = results.some((hasSubmission) => hasSubmission);

    if (submitted) {
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  } catch (error) {
    console.error("Error fetching submissions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
const ReSubmission = AsyncHandler(async (req, res, next) => {
  const student = req.user._id;
  const assignmentId = req.params.aid;

  try {
    const getquestions = await question.find({ Assignment: assignmentId });
    
    const promises = getquestions.map(async (ques) => {
      const getReSubmission = await resubmit.find({ student: student, question: ques._id });
      console.log(getReSubmission)
      return getReSubmission.length > 0;
    });

    const results = await Promise.all(promises);
    const Resubmitted = results.some((hasSubmission) => hasSubmission);
    console.log(Resubmitted)
    if (Resubmitted) {
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
        const testResults = await testResult
          .find({
            _id: { $in: submission.testResults },
          })
          .populate('testCase')
          .lean();
      
        const totalTestCases = testResults.length;
        const halfCount = Math.ceil(totalTestCases / 2); 
      
        // Shuffle test cases randomly
        const shuffledTestResults = testResults.slice();
        for (let i = shuffledTestResults.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffledTestResults[i], shuffledTestResults[j]] = [shuffledTestResults[j], shuffledTestResults[i]];
        }
      
        // first half as shown and the second half as hidden
        const testResultsModified = shuffledTestResults.map((tr, index) => {
          return {
            ...tr,
            isHidden: index >= halfCount,
          };
        });
      
        console.log(testResultsModified);
      
        const submissionData = {
          questionDescription: questionData.questionDescription,
          TotalMarks: questionData.questionTotalMarks,
          ObtainedMarks: submission.obtainedMarks,
          testResults: testResultsModified,
        };
        formattedResponse.push(submissionData);
      }
      
      
  
      res.json({ formattedResponse });
    } catch (error) {
      console.error("Error fetching submissions:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  const getReSubmission = AsyncHandler(async (req, res, next) => {
    const student = req.user._id;
  
    try {
      const { assignmentId } = req.query;
      const questions = await question.find({
        Assignment: assignmentId,
      });

      const questionIds = questions.map((q) => q._id);
      const submissions = await resubmit.find({
        student: student,
        question: { $in: questionIds },
      });


      const formattedResponse = [];
      
      for (const submission of submissions) {
        const questionData = questions.find((q) => q._id.equals(submission.question));
        const testResults = await testResult
          .find({
            _id: { $in: submission.testResults },
          })
          .populate('testCase')
          .lean();
      
        const totalTestCases = testResults.length;
        const halfCount = Math.ceil(totalTestCases / 2); 
      
        // Shuffle the test cases randomly
        const shuffledTestResults = testResults.slice();
        for (let i = shuffledTestResults.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffledTestResults[i], shuffledTestResults[j]] = [shuffledTestResults[j], shuffledTestResults[i]];
        }
      
        // Mark the first half as shown and the second half as hidden
        const testResultsModified = shuffledTestResults.map((tr, index) => {
          return {
            ...tr,
            isHidden: index >= halfCount,
          };
        });
      
        console.log(testResultsModified);
      
        const submissionData = {
          questionDescription: questionData.questionDescription,
          TotalMarks: questionData.questionTotalMarks,
          ObtainedMarks: submission.obtainedMarks,
          testResults: testResultsModified,
        };
        formattedResponse.push(submissionData);
      }
      
      
  
      res.json({ formattedResponse });
    } catch (error) {
      console.error("Error fetching submissions:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  
 

  const allAssignmentSubmissions = async (req, res, next) => {
    try {
        const Aid = req.params.aid;

        const questions = await question.find({ Assignment: Aid });
        const submissions = await submission.find({ question: { $in: questions.map(q => q._id) } });
        const results = [];
        const submissionsByStudent = {};

        submissions.forEach(submission => {
            const studentId = submission.student;

            if (!submissionsByStudent[studentId]) {
                submissionsByStudent[studentId] = {
                    studentId,
                    studentName: "", 
                    totalQuestionsSubmitted: 0,
                    totalObtainedMarks: 0,
                    submissionDate: "", 
                };
            }

       
            submissionsByStudent[studentId].totalQuestionsSubmitted++;
            submissionsByStudent[studentId].totalObtainedMarks += submission.obtainedMarks;
            if (!submissionsByStudent[studentId].submissionDate) {
                submissionsByStudent[studentId].submissionDate = submission.submittedDate;
            }
        });

        const studentIds = Object.keys(submissionsByStudent);

        const studentNames = await student.find({ userID: { $in: studentIds } });

        studentNames.forEach(student => {
            const studentId = student.userID;
            if (submissionsByStudent[studentId]) {
                submissionsByStudent[studentId].studentName = student.userName;
            }
        });

        results.push(...Object.values(submissionsByStudent));

        const finalizedResults = results.map((result)=>
        {
            return {
              studentId: result.studentId,
            studentName: result.studentName,
          totalQuestionsSubmitted: result.totalQuestionsSubmitted,
          totalObtainedMarks: result.totalObtainedMarks,
          submissionDate: result.submissionDate.toISOString().split('T')[0],
          submissionTime : result.submissionDate.toISOString().split('T')[1].split('.')[0]
            }
        })

        res.send(finalizedResults);

    } catch (error) {
        
        next(error);
    }
}


const getGrades = async (req, res, next) => {
  try {
    const Cid = req.params.cid;
    const assignments = await assignment.find({ CourseID: Cid });

    const gradedAssignments = await Promise.all(
      assignments.map(async (assignment) => {
        const questions = await question.find({
          Assignment: assignment._id,
        });

        const questionIds = questions.map((q) => q._id);

        const submissions = await submission.find({
          student: req.user._id,
          question: { $in: questionIds },
        });

        if (submissions.length > 0) {
          // If submissions exist, the assignment is submitted
          const obtainedMarks = submissions.reduce(
            (total, sub) => total + sub.obtainedMarks,
            0
          );

          return {
            id : assignment._id,
            dueDate: assignment.dueDate.toISOString().split('T')[0],
            assignmentNumber: assignment.assignmentNumber,
            status: "submitted",
            obtainedMarks : obtainedMarks,
            totalMarks: questions.reduce( (total, q) => total + q.questionTotalMarks, 0)
          };
        } else {
          const currentDate = new Date();
          if (currentDate > assignment.dueDate) {
            // If no submissions and due date passed, assignment not submitted
            return {
              id : assignment._id,
              dueDate: assignment.dueDate.toISOString().split('T')[0],
              assignmentNumber: assignment.assignmentNumber,
              status: "not submitted",
              obtainedMarks: 0,
              totalMarks: questions.reduce( (total, q) => total + q.questionTotalMarks, 0),
            };
          } else {
            // If no submissions and due date hasn't passed yet, assignment is pending
            return {
              id : assignment._id,
              dueDate: assignment.dueDate.toISOString().split('T')[0],
              assignmentNumber: assignment.assignmentNumber,
              status: "pending",
              obtainedMarks: 'yet to be solved',
              totalMarks: questions.reduce( (total, q) => total + q.questionTotalMarks, 0),
            };
          }
        }
      })
    );
      console.log(gradedAssignments)
    return res.send(gradedAssignments);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  Submission,
  getSubmission,
  getReSubmission,
  ReSubmission,
  allAssignmentSubmissions,
  getGrades
};
