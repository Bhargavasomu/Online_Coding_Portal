var probsJSON = require('../problems.json');
var fs = require('fs');
var path = require('path');
var c_compiler = require('../compilers/c_compiler.js');
var mysql = require('mysql');

exports.main_page = function(req, res)
{
	if(req.session.user_id)
		res.redirect('/dashboard');
	else
	{
		res.render('main_page',{
			title: "Main Page"
		})
	}
}

exports.render_login_page = function(req, res)
{
	res.render('login',{
		title : "Login"
	});
}

function validateEmail(email)
{
	var patt = /\S+@\S+\.\S+/;			// regex for email
    var res = patt.test(email);
	return res;
}

exports.verify_login_creds = function(req, res)
{
	var postData = req.body;
	var email = postData.email;
	var pswd = postData.pswd;
	// Status 0 is that email and password are valid
	// Status 1 is that email given is not a valid email addres
	// Status 2 is that the credentials are not registered
	if(!validateEmail(email))
	{
		res.send("1");
	}
	else
	{
		var con = mysql.createConnection({
			host: "localhost",
		    user: "root",
		    password: "somu",
			database: "oj_creds"
		});
		con.connect(function(err)
		{
			if(err)
				console.log(err);
			console.log("Connected to mysql");
			// \' is used to insert apostrophes inside a string
			var query = "SELECT * FROM user_data WHERE email=\'" + email + "\' AND password=\'" + pswd + "\'";
			con.query(query, function(err, result, fields)
			{
				if(err)
					throw err;
			    if(result.length == 0)		// user is not registered
				{
					res.send("2");
				}
				else
				{
					// user is registered
					req.session.user_id = 1;
					res.send("0");
				}
			});
		});
	}
}

exports.logout = function(req, res)
{
	req.session.destroy(function(err)
	{
		if(err)
		{
			console.log("Error in Logout: " + err);
		}
		else
		{
			console.log("Logout is a Success");
			res.redirect('/');
		}
	});
}

exports.render_register_page = function(req, res)
{
	res.render('register',{
		title : "Register"
	});
}

exports.insert_register_creds = function(req, res)
{
	var postData = req.body;
	var fname = postData.fname;
	var lname = postData.lname;
	var email = postData.email;
	var pswd = postData.pswd;
	// Status 0 means that the insert was a success
	// Status 1 means that the Email ID is invalid
	// Status 2 means that the Credentials were not entered into DB due to some reasons
	if(!validateEmail(email))
	{
		res.send("1");
	}
	else
	{
		var con = mysql.createConnection({
			host: "localhost",
		    user: "root",
		    password: "somu",
			database: "oj_creds"
		});
		con.connect(function(err)
		{
			if(err)
				console.log(err);
			else
			{
				console.log("Connected to mysql");
				// \' is used to insert apostrophes inside a string
				var query = "INSERT INTO user_data(firstname,lastname,email,password) VALUES (\'" + fname + "\',\'" + lname + "\',\'" + email + "\',\'" + pswd + "\')";
				con.query(query, function(err, result, fields)
				{
					if(err)
					{
						console.log(err);
						res.send("2");
					}
				    else
					{
						req.session.user_id = 1;
						res.send("0");
					}
				});
			}
		});
	}

}

exports.dashboard = function(req, res)
{
	var probs = probsJSON.probs;
	res.render('home',
	{
        title:"Home Page",
        probs:probs
    });
};

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
