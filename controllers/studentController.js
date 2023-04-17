var Student = require('../models/student')
var AsyncHandler = require("express-async-handler");
var generateToken = require("../Utills/generateToken")
// Register User
const registerStudent = AsyncHandler(
    async(req, res, next)=>{
       const {userID,userName} = req.body
    
       const newStudent = await Student.create({userID,userName})
      
        if(newStudent){
        res.status(201).json({
            
            userID : newStudent.userID,
            userName : newStudent.userName
        })
            }


    }
)

module.exports = {
    registerStudent
}