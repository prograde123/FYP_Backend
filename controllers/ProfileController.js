var User = require("../models/user");
var Teacher = require ("../models/teacher");
var AsyncHandler = require("express-async-handler");
const getProfie = AsyncHandler(
    async(req,res,next)=>{
        const data = await User.findById(req.user._id)
        if(data){
            if(data.role == "Teacher"){
                const teacherData = await Teacher.find({userID: data._id})

            res.json({
                _id : data._id,
                fullName : data.fullName,              
                email : data.email,
                role: data.role,
                phoneNum : data.phoneNum,
                profilePic : data.profilePic,
                cv: teacherData.cv
            })
            }
            else{
                //for student profile
                res.status(201)
            }
        }
        else{
            res.status(404)
            throw new Error("User Not Found")

        }
    }
)
const updateProfile= AsyncHandler(
    async(res,req,next)=>{
        const findData = User.findById(req.user._id)
        if(findData){
            findData.fullName = req.body.fullName || findData.fullName
            findData.email = req.body.email || findData.email       
            findData.role = findData.role
            findData.phoneNum = req.body.phoneNum || findData.phoneNum
            findData.profilePic = req.body.profilePic || findData.profilePic

            const saveUser = await findData.save()
            if(findData.role == "Teacher"){
            const find = await Teacher.find({userID: findData._id})
            if(find){
                find.cv = req.body.cv || find.cv
            }
            const saveTeacher = await find.save()

            res.json({
                _id : saveUser._id,
                fullName : saveUser.fullName,              
                email : saveUser.email,
                role: saveUser.role,
                phoneNum : saveUser.phoneNum,
                profilePic : saveUser.profilePic,
                cv: saveTeacher.cv
            
                })
            }

         else{
                //student
                //     const find = await Student.find({userID: findData._id})
                //     if(find){
                //         student
                //     }
                //     const savestudent = await find.save()
        
             res.json({
                id : saveUser._id,
                fullName : saveUser.fullName,              
                email : saveUser.email,
                role: saveUser.role,
                phoneNum : saveUser.phoneNum,
                profilePic : saveUser.profilePic,
                 //Student attribut specific
                    
                })

            }
                
                
        }
    }
)
module.exports = {
    getProfie,
    updateProfile
}