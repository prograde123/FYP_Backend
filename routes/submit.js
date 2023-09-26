var express = require('express');
var router = express.Router();
var JavaController = require('../controllers/TestCase Controllers/Java/submitJavaController')
var PythonController = require('../controllers/TestCase Controllers/Python/submitPythonController')
var CController = require('../controllers/TestCase Controllers/C/submitCController')
var CppController = require('../controllers/TestCase Controllers/Cpp/submitCppController')
var SubmitCheckController = require('../controllers/checkSubmission')
var auth = require('../middleware/authorization')

router.post('/Java/:qid',auth,JavaController.uploadJava);
router.post('/Python/:qid',auth,PythonController.uploadPython);
router.post('/C/:qid' , auth,CController.uploadC )
router.post('/Cpp/:qid' ,auth, CppController.uploadCpp )
router.get('/isSubmitted/:aid' ,auth, SubmitCheckController.Submission  )
router.get('/getSubmissions' ,auth ,SubmitCheckController.getSubmission )

module.exports = router;