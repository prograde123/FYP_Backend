var express = require('express');
var router = express.Router();
var JavaController = require('../controllers/TestCase Controllers/Java/submitJavaController')
var PythonController = require('../controllers/TestCase Controllers/Python/submitPythonController')
var CController = require('../controllers/TestCase Controllers/C/submitCController')
var CppController = require('../controllers/TestCase Controllers/Cpp/submitCppController')

router.post('/Java/:qid',JavaController.uploadJava);
router.post('/Python/:qid',PythonController.uploadPython);
router.post('/C/:qid' , CController.uploadC )
router.post('/Cpp/:qid' , CppController.uploadCpp )

module.exports = router;