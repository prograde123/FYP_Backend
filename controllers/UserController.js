var User = require("../models/user");
var AsyncHandler = require("express-async-handler");
var generateToken = require("../Utills/generateToken");
var Teacher = require("../models/teacher");
// Register User
const registerUser = AsyncHandler(async (req, res, next) => {
  const { fullName, email, password, role, phoneNum, profilePic } = req.body;
  const emailExist = await User.findOne({ email });

  if (emailExist) {
    res.status(400);
    throw new Error("Email must be unique");
  }

  const newUser = await User.create({
    fullName,
    email,
    password,
    role,
    phoneNum,
    profilePic,
  });

  if (newUser) {
    res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      role: newUser.role,
      phoneNum: newUser.phoneNum,
      profilePic: newUser.profilePic,
      //token generate
      token: generateToken(newUser._id),
    });
  }
});
// SignIn user
const signinUser = AsyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const userExist = await User.findOne({ email });
  if (!userExist) {
    res.status(401);
    //throw new Error("Invalid Email");
  } else {
    if (await userExist.matchPassword(password)) {
      var userid = userExist._id;
      const teacher = await Teacher.findOne({ user: userid }).populate('user')
      console.log(teacher)
      res.json({
        teacher: teacher,
        //token generate
        token: generateToken(userExist._id),
      });
    } else {
      res.status(401);
      //throw new Error("Invalid Password");
    }
  }
});
module.exports = {
  registerUser,
  signinUser,
};
