var Teacher = require('../models/teacher')
var AsyncHandler = require("express-async-handler");
var generateToken = require("../Utills/generateToken")
// Register User
const registerTeacher = AsyncHandler(
    async(req, res, next)=>{
       const {userID,cv} = req.body
    
       const newTeacher = await Teacher.create({userID,cv})
      
        if(newTeacher){
        res.status(201).json({
            
            userID : newTeacher.userID,
            cv : newTeacher.cv
        })
            }
    }
)

module.exports = {
    registerTeacher
}