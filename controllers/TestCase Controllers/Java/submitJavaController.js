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
    var dir = "./controllers/TestCase Controllers/Java/app";
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


async function createSubmission(results, req, res) {
  console.log(results);
  const submissionData = {
    question : req.params.qid,
    student: req.user._id,  //add here student ID
    submittedDate: new Date(),
    codeFile: req.files[0].originalname,
    testResults: results,
    // plagairismReport:
    //obtainedMarks:
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

const uploadJava = async (req, res, next) => {
  const question = req.params.qid;

  const testCases = await testCase.find({ Question: question });
  const ques = await questionModel.findOne({ _id: question });

  upload(req, res, function (err) {
    if (err) {
      return res.end("Something went wrong :(");
    }

    //after middleware
    //  const StudentId = req.user._id
    //  console.log(StudentId)

    req.files.forEach((file) => {
      fs.readFile(file.path, "utf-8", (err, data) => {
        if (err) {
          console.error(`Error reading the file ${file.path}`);
        } else {
          console.log(`Content of the file ${file.originalname}:`);
         // console.log(data);
        }
      });
    });

    var codeFilePath = req.files[0].originalname;
    const results = [];

    function runTestCase(index) {
      if (index >= testCases.length) {
        createSubmission(results, req, res);
        return;
      }

      const testCase = testCases[index];
      const dockerExec = spawn("docker", [
        "exec",
        "-i",
        "java-javacomp-1",
        "java",
        codeFilePath,
      ]);

      let actualOutput = "";
      let errorOutput = "";

      dockerExec.stdout.on("data", (data) => {
        actualOutput += data.toString();
        console.log(actualOutput)
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

module.exports = { uploadJava };