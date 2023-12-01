var User = require("../models/user");
var Teacher = require ("../models/teacher");
var AsyncHandler = require("express-async-handler");
var student = require("../models/student");

const getProfie = AsyncHandler(
    async(req,res,next)=>{
        console.log("in gEt profile")
        const data = await User.findById(req.user._id)
        console.log(data)
        if(data){
            if(data.role == "Teacher"){
                const teacherData = await Teacher.findOne({user: data._id})

            res.json({
                _id : data._id,
                fullName : data.fullName,              
                email : data.email,
                role: data.role,
               
                profilePic : data.profilePic,
                cv: teacherData.cv
            })
            }
            else{
                //for student profile
                const studentData = await student.findOne({userID: data._id})
                console.log(studentData)
                res.json({
                    _id : data._id,
                    fullName : data.fullName,              
                    email : data.email,
                    role: data.role,
                   
                    profilePic : data.profilePic,
                    userName: studentData.userName
                })
            }
        }
        else{
            res.status(404)
            throw new Error("User Not Found")

        }
    }
)
const updateProfile = AsyncHandler(async (req, res, next) => {
    try {
        const {  userName, fullName, email,   profilePic, cv } = req.body;

        console.log(profilePic)
        const findData = await User.findById(req.user._id);

        if (findData) {
            const userData = {
                fullName: fullName || findData.fullName,
                email: email || findData.email,
                profilePic: profilePic || findData.profilePic
            };
            console.log(userData);
            const updatedUser = await User.findByIdAndUpdate(
                req.user._id,
                { $set: userData },
                { new: true }
            );

            let cvData = null;
            let studentUserName = null;

            if (findData.role === "Teacher") {
                const teacher = await Teacher.findOne({ user: findData._id });
            
                if (teacher) {
                    cvData = cv || teacher.cv;
                    await Teacher.updateOne({ user: findData._id }, { $set: { cv: cvData } });

                    res.json({
                        _id: updatedUser._id,
                        fullName: updatedUser.fullName,
                        email: updatedUser.email,
                        role: updatedUser.role,
                        
                        profilePic: updatedUser.profilePic,
                        cv: cvData
                    });
                }
            } else {
                const studentData = await student.findOne({ userID: findData._id });
            
                if (studentData) {
                    studentUserName = userName || studentData.userName;
                    await student.updateOne({ userID: findData._id }, { $set: { userName: studentUserName } });
                    res.json({
                        _id: updatedUser._id,
                        fullName: updatedUser.fullName,
                        email: updatedUser.email,
                        role: updatedUser.role,
                       
                        profilePic: updatedUser.profilePic,
                        userName: studentUserName
                    });
                }
            }
            

           
        } else {
            res.status(404).json({ message: "User Not Found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
});


const updatePassword = async (req, res, next) => {
    try {
      const { previousPass, pass } = req.body;
       
      const findData = await User.findById(req.user._id);
  
      if (findData) {
       // const passwordChanged = await findData.changePassword(previousPass, pass);
  
        if (await findData.matchPassword(previousPass)) {
            findData.password = pass
            const updatedUser = await findData.save()
          res.status(200).json({
            message: 'Password changed successfully',
          });
        } else {
            console.log('Invalid Password')
          // Previous password doesn't match
          res.status(401).json({
            message: 'Invalid Password',
          });
        }
      } else {
        res.status(404).json({ message: "User Not Found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  };
  
  

module.exports = {
    getProfie,
    updateProfile,
    updatePassword
}