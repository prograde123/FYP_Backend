var express = require("express");
var multer = require("multer");
var AsyncHandler = require("express-async-handler");
var fs = require("fs");
const { spawn } = require("child_process");
const testCase = require("../../../models/testCase");
const questionModel = require("../../../models/question");
const testCaseResult = require("../../../models/testResult");
const Submission = require("../../../models/submission");

var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    var dir = "./controllers/TestCase Controllers/Cpp/app";
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

async function createSubmission(results, req, res,obtainedMarks) {
  console.log(results);
  const submissionData = {
    question: req.params.qid,
    student: req.user._id,
    submittedDate: new Date(),
    codeFile: req.files[0].originalname,
    testResults: results,
    
    obtainedMarks: obtainedMarks 
  };

  const submission = new Submission(submissionData);
  try {
    await submission.save();
    res.json({ results });
  } catch (error) {
    console.error(`Error saving Submission: ${error}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

const uploadCpp = async (req, res, next) => {
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
          console.log(`Content of the file ${file.originalname}:`);
          
        }
      });
    });

    var codeFilePath = req.files[0].originalname;
    const results = [];

    function runTestCase(index) {
      if (index >= testCases.length) {
        createSubmission(results, req, res,obtainedMarks);
        return;
      }

      const testCase = testCases[index];
      const dockerExec = spawn("docker", [
        "exec",
        "-i",
        "cpp-cppcomp-1",
        "sh",
        "-c",
        `g++ -o myprogram ${req.files[0].originalname} && ./myprogram`,
      ]);

      let actualOutput = "";
      let errorOutput = "";

      dockerExec.stdout.on("data", (data) => {
        actualOutput += data.toString();
      });

      dockerExec.stderr.on("data", (data) => {
        errorOutput += data.toString();
      });

      dockerExec.on("close", (code) => {
        const result = {
          testCase: testCase._id,
          input: testCase.input,
          output: testCase.output,
          actualOutput: actualOutput,
          errorOutput: errorOutput,
          passed:
            actualOutput.trim() === testCase.output.trim() &&
            errorOutput.trim() === "",
        };
        const testResult = new testCaseResult(result);
        try {
          testResult.save();
          results.push(testResult._id); // Storing the ObjectId in the results array
          // res.json({testResult})
          if (testResult.passed) {
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

module.exports = { uploadCpp };