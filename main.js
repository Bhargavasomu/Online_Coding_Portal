// The Global Variables
var TLETime = 2;            // The maximum allowed time in seconds before TLE
var MainMemoryLimit = 256     // The maximum limit of MainMemory allowed in MB

function compile(sourceCode,inputTestFile)      // compiles the code and checks for Compilation Errors
{
    var spawn = require('child_process').spawn;
    var child = spawn('gcc',[sourceCode]);
    child.on('error', function(e)
    {
        console.log("Compilation Command Not Found");
        process.exit();
    });
    child.on('exit', function(code)     // Comes here if there are no compilation errors
    {
        // code 0  means no trouble, code 1 means some issues, code 2 means serious trouble
        console.log('Compilation process exited with code ' + code.toString());
        displayOutput(inputTestFile);
    });
    child.stderr.on('data',function(data)
    {
        console.log(data.toString());
        console.log("Compilation Error");
        process.exit();
    });
}

function displayOutput(inputTestFile)
{
    var spawn = require('child_process').spawn;
    var outputSoFar = '';
    var child = spawn('./a.out');
    var fs = require('fs');
    if(inputTestFile)
    {
        // to redirect the file as input for the sourceCode
        file = fs.createReadStream(inputTestFile,{encoding:'utf8'});
        file.pipe(child.stdin);
    }
    setTimeout(TLEexitFunc,TLETime * 1000,child);
    child.stdout.on('data', function(data)
    {
        const maxOutputBytes = MainMemoryLimit * 1024 * 1024;   // converting to Bytes and each character takes 1 Byte
        const newLength = (outputSoFar.length + data.length);
        if(newLength > maxOutputBytes)
        {
            child.kill('SIGTERM');
            console.log("Main Memory Limit of " + MainMemoryLimit + " exceeded");
            process.exit();
        }
        outputSoFar += data;
    });
    child.on('exit', function(code)
    {
        console.log('Display process exited with code ' + code.toString());
        console.log(outputSoFar);
        process.exit();
    });
    child.on('error', function(e)
    {
        console.log("Executable Not Found");
    });
}

function TLEexitFunc(childProcess)   // function called when TLE occurs
{
    console.log("Time Limit of " + TLETime + " seconds Has been exceeded");
    childProcess.kill('SIGTERM');
    process.exit();
}

function main()
{
    compile('test2.c',null);  // time in milliseconds
}
main();
