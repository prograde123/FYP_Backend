var express = require('express');
var router = express.Router();
var JavaController = require('../controllers/TestCase Controllers/Java/submitJavaController')
var PythonController = require('../controllers/TestCase Controllers/Python/submitPythonController')
var CController = require('../controllers/TestCase Controllers/C/submitCController')
var CppController = require('../controllers/TestCase Controllers/Cpp/submitCppController')
var SubmitCheckController = require('../controllers/checkSubmission')
var auth = require('../middleware/authorization')

router.post('/Java/:qid/:isReSubmission',auth,JavaController.uploadJava);
router.post('/Python/:qid/:isReSubmission',auth,PythonController.uploadPython);
router.post('/C/:qid/:isReSubmission' , auth,CController.uploadC )
router.post('/Cpp/:qid/:isReSubmission' ,auth, CppController.uploadCpp )

router.get('/isSubmitted/:aid' ,auth, SubmitCheckController.Submission  )
router.get('/isReSubmitted/:aid',auth,SubmitCheckController.ReSubmission)
router.get('/getSubmissions' ,auth ,SubmitCheckController.getSubmission )
router.get('/getReSubmissions' ,auth ,SubmitCheckController.getReSubmission)
router.get('/AssignmentSubmissions/:aid' , SubmitCheckController.allAssignmentSubmissions)
router.get('/GetGrades/:cid' , auth , SubmitCheckController.getGrades )



//Get output from files
router.post('/getOutputPython/:testCases/:isInputArray' ,  auth , PythonController.getOutputPython)
router.post('/getOutputJava/:testCases/:isInputArray' , auth , JavaController.getOutputJava)
router.post('/getOutputC/:testCases/:isInputArray' ,  auth , CController.getOutputC)
router.post('/getOutputCpp/:testCases/:isInputArray' , auth , CppController.getOutputCpp)

module.exports = router;
