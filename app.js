var express = require('express');
var app = express();
var routes = require('./routes');
var path = require('path');
var fileUpload = require('express-fileupload');
// Serve ejs files
app.set('view engine', 'ejs');
// Serve static assets from the public folder
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());

// Routes

app.get('/', routes.home);

app.get('/problems/:problem_number?', routes.prob_single);

app.get('/submit/:problem_number?', routes.submit_problem);

app.post('/submit/:problem_number?', routes.upload);

app.get('/submission/:problem_number?', routes.submission_module);

app.get('*', routes.notFound);


// Listen on port 3000
app.listen(process.env.PORT || 3000);
