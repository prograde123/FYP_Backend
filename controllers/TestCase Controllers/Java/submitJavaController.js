var express = require('express');
var multer  = require('multer');
var AsyncHandler = require("express-async-handler");
var fs  = require('fs');
const { spawn } = require('child_process');
const testCase = require('../../../models/testCase');
const questionModel = require('../../../models/question');



var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        var dir = './controllers/TestCase Controllers/Java/app';
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
        callback(null, dir);
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});

var upload = multer({storage: storage}).array('files', 12);

// const testCases = [
//     {
//         input:[5, 5, 5, 5],      
//         output: "20" 
//     },
//     {
//         input: [5, 5, 5, 3],      
//         output: "13"
//     },
    
// ];

const uploadJava = 
    async(req,res,next)=>{
        const question = req.params.qid
    
        const testCases = await testCase.find({Question : question})
        const ques=await questionModel.findOne({_id: question})
        console.log(testCases)
    upload(req, res, function (err) {

        if (err) {
            return res.end("Something went wrong:(");
        }

        req.files.forEach(file => {
            fs.readFile(file.path, 'utf-8', (err, data) => {
                if (err) {
                    console.error(`Error reading the file ${file.path}`);
                } else {
                    console.log(`Content of the file ${file.originalname}:`);
                    console.log(data);

                }
            });
        });

        const codeFilePath = req.files[0].originalname;
        const results = [];

        function runTestCase(index) {
            if (index >= testCases.length) {
                res.json({ results });
                return;
            }

            const testCase = testCases[index];
            const dockerExec = spawn('docker', ['exec','-i', 'java-javacomp-1', 'java', codeFilePath]);

            let actualOutput = '';
            let errorOutput = '';

            dockerExec.stdout.on('data', (data) => {
                actualOutput += data.toString();
            });

            dockerExec.stderr.on('data', (data) => {
                errorOutput += data.toString();
            });

            dockerExec.on('close', (code) => {
                const result = {
                    input: testCase.input,
                    output: testCase.output,
                    actualOutput: actualOutput,
                    errorOutput: errorOutput,
                    passed: actualOutput.trim() === testCase.output.trim() && errorOutput.trim() === '',
                };
                results.push(result);
                runTestCase(index + 1);
            });
           
            const isInputArray = ques.isInputArray;

            if(isInputArray) {
                const inputBuffer = Buffer.from(testCase.input.map(String).join('\n'));
                dockerExec.stdin.write(inputBuffer);
                dockerExec.stdin.end();
            }
            else{
                dockerExec.stdin.write(testCase.input.replace(',', '\n')); 
                dockerExec.stdin.end();
            }
        }

        runTestCase(0);
    });
}

module.exports = { uploadJava }