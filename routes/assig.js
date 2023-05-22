var express = require('express');
var router = express.Router();
var assigController = require('../controllers/assignmentController')
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
  });

router.post('/addAssignment',assigController.addAssignment);
router.delete('/deleteAssignment' , assigController.deleteAssignment)
router.put('/editAssignment', assigController.editAssignment)
router.get('/viewAssigList/:cid', assigController.viewAssignmentList)
router.get('/viewAssignment',assigController.viewAssignment)
router.get('/submiitedAssigList',assigController.viewSubmittedList)




  module.exports = router;