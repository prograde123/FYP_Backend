var Teacher = require("../models/teacher");
var AsyncHandler = require("express-async-handler");
var generateToken = require("../Utills/generateToken");
// Register User

const registerTeacher = AsyncHandler(async (req, res, next) => {
  const { userID, cv } = req.body;

  const newTeacher = new Teacher({ user: userID, cv: cv });
  await newTeacher.save();
  const teacherID = newTeacher._id;

  if (newTeacher) {
    res.status(201).json({
      id: teacherID,
      userID: newTeacher.user,
      cv: newTeacher.cv,
    });
  }
});

module.exports = {
  registerTeacher,
};
