var User = require("../models/user");
var AsyncHandler = require("express-async-handler");
var generateToken = require("../Utills/generateToken");
var Teacher = require("../models/teacher");
var Assignment = require('../models/assignment');
var Course= require("../models/course");

const { response } = require("express");


const addAssignment= AsyncHandler(async(req,res,next)=>{
    const {assignmentNumber,description,uploadDate,dueDate,totalMarks,assignmentFile,format} = req.body;
    const assig = new Assignment({assignmentNumber,description,uploadDate,dueDate,totalMarks,assignmentFile,format});
    const assignmentID = assig._id
    assig.save((err, data) => {
        if (err) {
          res.statusCode = 504
          res.json({ error: err });
          return;
        }
        console.log(data)
        const courseid = req.body.courseid;
        Course.updateOne(
          { _id: courseid },
          { $push: { assignments: { _id: assignmentID } } },
          (err, data) => {
            if (err) {
              res.statusCode = 504
              res.json({ error: err });
              return;
            }
            
          }
        );
        res.json({ success: `Assignment successfully uploaded! ${assignmentID}` });
      });
}

)

const editAssignment = AsyncHandler(async(req,res,next)=>{
  
  const {assigId,assignmentNumber,title,description,uploadDate,dueDate,totalMarks,assignmentFile} = req.body;
  const assignment= await Assignment.findById(assigId)

  if(assignment){
    assignment.assignmentNumber = assignmentNumber ||  assignment.assignmentNumber
    assignment.title = title || assignment.title
    assignment.description = description || assignment.description
    assignment.uploadDate = uploadDate || assignment.uploadDate
    assignment.dueDate = dueDate || assignment.dueDate
    assignment.totalMarks = totalMarks || assignment.totalMarks
    assignment.assignmentFile = assignmentFile || assignment.assignmentFile

    const updatedOne = await Assignment.save()
  res.status(200).json({
    success: 'updated successfully!'
  })
  }

  else{
    response.status(404)
    throw new Error('Not updated')
  }
})
const deleteAssignment = AsyncHandler(async(req, res, next) => {
    const assignmentid = req.body;
    const courseid = req.body;
    await Course.updateOne(
      { _id: courseid },
      {
        $pull: {
          assignments: { assignmentID: assignmentid },
        },
      },
      (err, result) => {
        if (err) {
          res.status(501);
          res.json({ error: err });
          return;
        }
      }
    )
      const deletedAssignment = await Assignment.findOneAndDelete({ _id: assignmentid });
      res.status(200);
      res.json({ success: "Assignment remved from course" });
  })


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
  async(req,res,next) => {
    const course = await Course.findOne({ _id: req.params.cid })
    .populate("assignments");
  var assignments = []
  for(i = 0 ; i < course.assignments.length ; i++){
        const assig = await Assignment.findOne({_id: course.assignments[i]._id})
       assignments.push(assig)
    }
    res.json(assignments);
    

  }
)

const viewAssignment = AsyncHandler(
  async(req,res,next)=>{
    const Assignmentid= req.body
    const viewOne = await Assignment.findById(Assignmentid)

    res.status(200).json({
      Viewassignment:viewOne
    })
  }
)
module.exports = {
  viewAssignment,deleteAssignment,addAssignment,editAssignment,viewAssignmentList,viewSubmittedList
}