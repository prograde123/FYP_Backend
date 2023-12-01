var express = require('express');
var router = express.Router();
var plagiarismController = require('../controllers/PlagiarismController')
var auth = require('../middleware/authorization')


router.get('/isSubmitted/:aid' ,auth, plagiarismController.DoesStudentAlreadyCheck  )
router.get('/getReports/:aid' ,auth, plagiarismController.getReports  )

router.put('/updateSubmission/:qid' ,auth, plagiarismController.updateSubmissions  )
router.post('/makePlagReport' ,auth, plagiarismController.makePlagReport  )


module.exports = router;