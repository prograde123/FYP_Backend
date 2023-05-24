var User = require("../models/user");
var AsyncHandler = require("express-async-handler");
var generateToken = require("../Utills/generateToken");
var Teacher = require("../models/teacher");
var Assignment = require('../models/assignment');
var Course= require("../models/course");
const { Types } = require('mongoose');

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
  
  const {assigId,assignmentNumber,description,uploadDate,dueDate,totalMarks,assignmentFile,format} = req.body;
  //const assignment= await Assignment.findById(assigId)
  try{
  const assignment = await Assignment.updateOne(
    {_id : assigId},
    {
      assignmentNumber : assignmentNumber ,


    description : description ,
    uploadDate : uploadDate ,
    dueDate : dueDate ,
    totalMarks : totalMarks ,
    assignmentFile : assignmentFile ,
   format : format 

    }
  )
    
    res.json({ success: `Assignment successfully updated! ` });
  }
  catch(err) {
    res.send({ message: err });
  }
})
const deleteAssignment = AsyncHandler(async(req, res, next) => {
    const assignmentid = req.params.aid;
    const courseid = req.params.cid;
    if (!Types.ObjectId.isValid(courseid)) {
      res.status(400).json({ error: 'Invalid courseid' });
      return;
    }
    Course.updateOne(
      { _id: courseid },
      {
        $pull: {
         // assignments: { assignmentID: assignmentid },
            assignments: { _id: assignmentid } ,

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

    res.json({assignments: assignments});
    

  }
)

const viewAssignment = AsyncHandler(
  async(req,res,next)=>{
    
    const viewOne = await Assignment.findById(req.params.aid)

    res.status(200).json({
      Viewassignment:viewOne
    })
  }
)
module.exports = {
  viewAssignment,deleteAssignment,addAssignment,editAssignment,viewAssignmentList,viewSubmittedList
}