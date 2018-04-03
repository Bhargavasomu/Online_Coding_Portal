// The Global Variables
var TLETime = 2;            // The maximum allowed time in seconds before TLE
var MainMemoryLimit = 256;     // The maximum limit of MainMemory allowed in MB
var TLE_Flag;
var MEM_Exceeded_Flag;

function compile(sourceCode,inputTestFile,callback)      // compiles the code and checks for Compilation Errors
{
    TLE_Flag = false;           // becomes true when TLE occurs
    MEM_Exceeded_Flag = false;  // becomes true when Memory is exceeded
    var spawn = require('child_process').spawn;
    var child = spawn('gcc',[sourceCode]);
    child.on('error', function(e)
    {
        console.log("Compilation Command Not Found");
        process.exit();
    });
    child.on('exit', function(code)     // Comes here if there are no compilation errors
    {
        createOutput(inputTestFile,callback);
    });
    child.stderr.on('data',function(data)
    {
        console.log("Compilation Error");
        callback("Compilation Error");
    });
}

function createOutput(inputTestFile,callback)
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
    var timeout = setTimeout(TLEexitFunc, TLETime * 1000, child, callback);
    child.stdout.on('data', function(data)
    {
        const maxOutputBytes = MainMemoryLimit * 1024 * 1024;   // converting to Bytes and each character takes 1 Byte
        const newLength = (outputSoFar.length + data.length);
        if(newLength > maxOutputBytes)
        {
            MEM_Exceeded_Flag = true;
            child.stdout.destroy();     // child.kill() doesn't kill the streams, hence this command needs to be performed
            child.stderr.destroy();
            child.kill('SIGTERM');
            clearTimeout(timeout);
            return callback("Main Memory Limit of " + MainMemoryLimit + " exceeded");
        }
        outputSoFar += data;
    });
    child.on('exit', function(code)
    {
        // clear Timer and Render Output
        clearTimeout(timeout);
        if((TLE_Flag==false)&&(MEM_Exceeded_Flag==false))
            callback(outputSoFar);
    });
    child.on('error', function(e)
    {
        console.log("Executable Not Found");
    });
}

function TLEexitFunc(childProcess,callback)   // function called when TLE occurs
{
    TLE_Flag = true;
    childProcess.kill('SIGTERM');
    callback("Time Limit of " + TLETime + " seconds Has been exceeded");
}

exports.compile = compile;
