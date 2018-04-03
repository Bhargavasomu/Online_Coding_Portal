var probsJSON = require('../problems.json');
var fs = require('fs');
var path = require('path');
var c_compiler = require('../compilers/c_compiler.js');

// Home Route
exports.home = function(req, res)
{
	var probs = probsJSON.probs;
	res.render('home',
	{
        title:"Home Page",
        probs:probs
    });
};

// Problem-single route
exports.prob_single = function(req, res)
{
	var prob_number = req.params.problem_number;
    var probs = probsJSON.probs;
	// Only render the problem_single template for Problems that exist
	if (prob_number >= 1 && prob_number <= probs.length)
    {
		var pdfFile = path.join(__dirname, '../problems_pdf/' + probs[prob_number-1].pdf_name);
		fs.readFile(pdfFile, function (err,data)
		{
			if(err)		// occurs when file is not found
			{
				res.send("Problem Statement Still Not Uploaded");
			}
			else
			{
			    res.contentType("application/pdf");
			    res.send(data);
			}
		});
	}
    else
    {
		res.render('notFound',
		{
			title : "Not Found"
		});
	}
};

exports.submit_problem = function(req, res)
{
	var prob_number = req.params.problem_number;
    var probs = probsJSON.probs;
	if (prob_number >= 1 && prob_number <= probs.length)
    {
		res.render('submit_page',
		{
			title: "Submit Code",
			prob_number: prob_number
		});
	}
    else
    {
		res.render('notFound',
		{
			title : "Not Found"
		});
	}
}

exports.upload = function(req, res)
{
	var prob_number = req.params.problem_number;
    var probs = probsJSON.probs;
	if (prob_number >= 1 && prob_number <= probs.length)
    {
		// res.send("hola");
		if(!req.files)
    		return res.status(400).send('No files were uploaded');
		var uploaded_file = req.files.fileToUpload;

		// Use the mv() method to place the file in uploads
		var src_file_path = path.join(__dirname, '../uploads/' + uploaded_file.name);
		uploaded_file.mv(src_file_path, function(err)
		{
			if(err)
				return res.status(500).send(err);
			res.redirect('/submission/' + prob_number);
		});
	}
	else
	{
		res.send("Posted to wrong url");
	}
}

function getRecentFile(dir)
{
	// mtime gives the time of modification wrt 1900
	var files = fs.readdirSync(dir,'utf8');
	var response = [];
	var i;
	for(i=0; i<files.length; i++)
	{
		var stats = fs.statSync(dir + "/" + files[i]);
		if(stats.isFile())
			response.push({"fileName":files[i], "mtime": stats.mtime.getTime()});
	}
	var ans = response[0];
	for(i=1;i<response.length;i++)
	{
		if(response[i].mtime > ans.mtime)
			ans = response[i];
	}
	return ans.fileName;
}

exports.submission_module = function(req, res)
{
	// res.render('view_submission',
	// {
	// 	title: "View Submission",
	// 	completed: "no",
	// 	code_exec_response: ""
	// });
	var recently_uploaded_file = getRecentFile(path.join(__dirname, '../uploads'));
	var pres_path = path.join(__dirname, '../uploads/' + recently_uploaded_file);
	c_compiler.compile(pres_path,null, function(response)
	{
		console.log("Hey callbacked, " + response);
		// res.send(response);
		res.render('view_submission',
		{
			title: "View Submission",
			completed: "yes",
			code_exec_response: response
		});
	});
}

// Route for all other page requests
exports.notFound = function(req, res)
{
	res.render('notFound',
    {
		title : "Not Found"
	});
};
