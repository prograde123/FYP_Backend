var express = require("express");
var multer = require("multer");
var AsyncHandler = require("express-async-handler");
var fs = require("fs");
const { spawn } = require("child_process");
const testCase = require("../../../models/testCase");
const questionModel = require("../../../models/question");
const testCaseResult = require("../../../models/testResult");
const Submission = require("../../../models/submission");
const resubmit = require("../../../models/resubmit");
var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    var dir = "./controllers/TestCase Controllers/C/app";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    callback(null, dir);
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  },
});

var upload = multer({ storage: storage }).array("files", 12);

async function createSubmission(results, req, res, obtainedMarks) {
  let submission
    const submissionData = {
        question: req.params.qid,
        student: req.user._id,  
        submittedDate: new Date(),
        codeFile: req.files[0].originalname,
        testResults: results,
        obtainedMarks: Math.round(obtainedMarks,2)
    };
    const isReSubmissionRequest= JSON.parse(req.params.isReSubmission)
    
    if(isReSubmissionRequest){
        submission = new resubmit(submissionData)
    }
    else{
        submission = new Submission(submissionData);
    }
    try {
        await submission.save();
        res.json({ results });
    } catch (error) {
        console.error(`Error saving Submission: ${error}`);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

function updateCCode(filePath) {
  let CCode = fs.readFileSync(filePath, 'utf-8');
  const regex = /printf\("((?![\\n* ]).*)"\)/g;
  javaCode = CCode.replace(regex, function (match, capturedContent) {

    return 'printf("")';
  });
  console.log("updated code",javaCode)

  fs.writeFileSync(filePath, javaCode, 'utf-8');
}

//first scenario
const uploadC = async (req, res, next) => {
  const question = req.params.qid;

  const testCases = await testCase.find({ Question: question });
  const ques = await questionModel.findOne({ _id: question });
  
  const eachTestCaseMarks =
    parseFloat(ques.questionTotalMarks) / parseFloat(testCases.length);

  upload(req, res, function (err) {
    if (err) {
      return res.end("Something went wrong :(");
    }

    let obtainedMarks = 0;

    req.files.forEach((file) => {
      fs.readFile(file.path, "utf-8", (err, data) => {
        if (err) {
          console.error(`Error reading the file ${file.path}`);
        } else {
          updateCCode(file.path)
          
        }
      });
    });

    var codeFilePath = req.files[0].originalname;
    const results = [];

    function runTestCase(index) {
      if (index >= testCases.length) {
        createSubmission(results, req, res, obtainedMarks);
        return;
      }
    
      const testCase = testCases[index];
      const dockerExec = spawn("docker", [
        "exec",
        "-i",
        "c-ccomp-1",
        "sh",
        "-c",
        `gcc -o myprogram ${req.files[0].originalname} && ./myprogram`,
      ]);
    
      let actualOutput = ""; // Store the entire output as a single string
      let errorOutput = "";
    
      dockerExec.stdout.on("data", (data) => {
        actualOutput += data.toString();
        console.log("actual output " , actualOutput)
      });
    
      dockerExec.stderr.on("data", (data) => {
        errorOutput += data.toString();
        console.log("actual output " , errorOutput)
      });
    
      dockerExec.on("close", (code) => {
        const expectedOutputLines = testCase.output.split("\n"); // Split expected output into lines
        const actualOutputLines = actualOutput.split("\n"); // Split actual output into lines
        console.log("actualOutputLines " ,actualOutputLines)
        // Remove empty lines from the actual output
        const cleanedActualOutputLines = actualOutputLines.filter((line) => line.trim() !== "");
    
        let passed = errorOutput.trim() === "" && 
          expectedOutputLines.length === cleanedActualOutputLines.length;
    
        if (passed) {
          for (let i = 0; i < expectedOutputLines.length; i++) {
            if (expectedOutputLines[i].trim() !== cleanedActualOutputLines[i].trim()) {
              passed = false;
              break;
            }
          }
        }
    
        const result = {
          testCase: testCase._id,
          input: testCase.input,
          output: testCase.output,
          actualOutput: actualOutput,
          errorOutput: errorOutput,
          passed: passed,
        };
    
        const testResult = new testCaseResult(result);
        try {
          testResult.save();
          results.push(testResult._id); // Storing the ObjectId in the results array
    
          if (passed) {
            obtainedMarks += eachTestCaseMarks;
          }
          runTestCase(index + 1);
        } catch (error) {
          console.error(`Error saving TestResult: ${error}`);
        }
        
      });
    
      const isInputArray = ques.isInputArray;
    
      if (isInputArray) {
        const inputBuffer = Buffer.from(testCase.input.map(String).join("\n"));
        dockerExec.stdin.write(inputBuffer);
        dockerExec.stdin.end();
      } else {
        dockerExec.stdin.write(testCase.input.replace(",", "\n"));
        dockerExec.stdin.end();
      }
    }
    

    runTestCase(0);
  });
};


//second scenario
const getOutputC = async (req, res, next) => {
  const testCasesString = req.params.testCases;
  const isInputArray = req.params.isInputArray;
  const isArr = JSON.parse(isInputArray);
  
  let testCases;
  
  if (isArr) {
    testCases = JSON.parse(testCasesString);
  } else {
    testCases = JSON.parse(testCasesString);
  }


  upload(req, res, function (err) {
    if (err) {
      return res.end("Something went wrong :(");
    }

    req.files.forEach((file) => {
      fs.readFile(file.path, "utf-8", (err, data) => {
        if (err) {
          console.error(`Error reading the file ${file.path}`);
        } else {
          updateCCode(file.path)
          console.log(`Content of the file ${file.originalname}:`);
          //console.log(data);
        }
      });
    });

    var codeFilePath = req.files[0].originalname;

    const OutputArray = []
    function runTestCase(index) {
      
      if (testCases.length <= index) {

        let inputOutputArray = []


        for(i=0;i<testCases.length ; i++){
          inputOutputArray.push({
            input : testCases[i].input,
            output : OutputArray[i]
          })
        }
    
        
        res.send(inputOutputArray);
    
        return;
      }
    const testCase = testCases[index].input;



    const dockerExec = spawn("docker", [
      "exec",
      "-i",
      "c-ccomp-1",
      "sh",
      "-c",
      `gcc -o myprogram ${req.files[0].originalname} && ./myprogram`,
    ]);

      let actualOutput = "";
      let errorOutput = "";

      dockerExec.stdout.on("data", (data) => {
        actualOutput += data.toString();
        OutputArray.push(actualOutput.split('\n')[0])
      });

      dockerExec.stderr.on("data", (data) => {
        errorOutput += data.toString();
      });

      dockerExec.on("close", (code) => {

        
        runTestCase(index + 1);
     
      });



      if (isArr) {
        const inputBuffer = Buffer.from(testCase.map(String).join("\n"));
        dockerExec.stdin.write(inputBuffer);
        
      } else {
        dockerExec.stdin.write(testCase.replace(",", "\n"));
       
      }
      dockerExec.stdin.end();
    }

    runTestCase(0);
  });
};

module.exports = { uploadC , getOutputC };
