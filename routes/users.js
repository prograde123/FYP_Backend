var express = require('express');
var router = express.Router();
var UserController = require('../controllers/UserController');
var StudentController = require('../controllers/studentController');
var teacherController = require('../controllers/teacherController');
var ProfileController = require ('../controllers/ProfileController');
var auth = require ('../middleware/authorization');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.post('/signup', UserController.registerUser);
router.post('/signupStudent', StudentController.registerStudent);
router.post('/signupTeacher', teacherController.registerTeacher);
router.post('/signin', UserController.signinUser);
router.get('/ViewProfile',auth,ProfileController.getProfie);
router.post('/UpdateProfile',auth,ProfileController.updateProfile)

module.exports = router;
