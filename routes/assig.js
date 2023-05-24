var express = require('express');
var router = express.Router();
var assigController = require('../controllers/assignmentController')
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
  });

router.post('/addAssignment',assigController.addAssignment);
router.delete('/deleteAssignment/:cid/:aid' , assigController.deleteAssignment)
router.patch('/editAssignment', assigController.editAssignment)
router.get('/viewAssigList/:cid', assigController.viewAssignmentList)
router.get('/viewAssignment/:aid',assigController.viewAssignment)
router.get('/submiitedAssigList',assigController.viewSubmittedList)




  module.exports = router;