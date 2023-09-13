var express = require('express');
var multer  = require('multer');
var AsyncHandler = require("express-async-handler");
var fs  = require('fs');
const { spawn } = require('child_process');
const testCase = require('../../../models/testCase');
const questionModel = require('../../../models/question');



var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        var dir = './controllers/TestCase Controllers/C/app';
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
//         input: "5,5",     
//         output: "10"
//     },
//     {
//         input: "8,8",     
//         output: "13" 
//     },
//     // Add more test cases as needed
// ];

const uploadC = 
    async(req,res,next)=>{
        const question = req.params.qid
    
        const testCases = await testCase.find({Question : question})
        const ques=await questionModel.findOne({_id: question})

        upload(req, res, function (err) {

            if (err) {
                return res.end("Something went wrong:(");
            }
    
            const codeFilePath = req.files[0].originalname;
            const results = [];
    
            function runTestCase(index) {
                if (index >= testCases.length) {
                    res.json({ results });
                    return;
                }
    
                const testCase = testCases[index];
                const dockerExec = spawn('docker', ['exec','-i', 'c-ccomp-1', 'sh', '-c', `gcc -o myprogram ${req.files[0].originalname} && ./myprogram`]);
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
                // this will come from question model
                //jis question ka response jama kra raha hoga 
                //us ko find kr k us ka isInputArray de dena yahan 
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

module.exports = { uploadC }