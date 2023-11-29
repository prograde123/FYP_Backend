var express = require('express');
var router = express.Router();
var assigController = require('../controllers/assignmentController')
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
  });

router.post('/addAssignment',assigController.addAssignment);
router.get('/viewAssigList/:cid', assigController.viewAssignmentList)
router.get('/viewAssignment/:aid',assigController.viewAssignment)
router.get('/submiitedAssigList',assigController.viewSubmittedList)


//edit 
router.put('/editAssignment', assigController.editAssignment)
router.put('/editquestion',assigController.editQuestion)
router.put('/addQuestionInAssignment',assigController.addQuestionInAssignment)
router.put('/editTestCase',assigController.editTestCase)
router.post('/AddTestCaseInQuestion',assigController.AddTestCaseInQuestion)

//delete
router.delete('/deleteAssignment/:cid/:aid' , assigController.deleteAssignment)
router.delete('/deleteQuestion/:qid', assigController.deleteQuestion)
router.delete('/deleteTestCase/:tid' , assigController.deleteTestCases)


//get IDs of submitted Students
router.get('/getStudentIds/:aid',assigController.getStudentsByAssignmentId)

module.exports = router;