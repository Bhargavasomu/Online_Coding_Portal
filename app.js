var express = require('express');
var routes = require('./routes');
var path = require('path');
var fileUpload = require('express-fileupload');
var bodyParser = require('body-parser');
var session = require('express-session');

var app = express();

// Serve ejs files
app.set('view engine', 'ejs');
// Serve static assets from the public folder
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));    // to support URL-encoded bodies
app.use(session({ secret: '123456' }));     // this secret key is used for hashing

function checkAuth(req, res, next)  // middleware Function To Check Authentication when visiting a page
{
    if(!req.session.user_id)    // this is set when person logins
    {
        res.send('You are not authorized to view this page');
    }
    else
    {
        next();
    }
}

// Routes

app.get('/',routes.main_page);

app.get('/login',routes.render_login_page);

app.post('/login',routes.verify_login_creds);

app.get('/register',routes.render_register_page);

app.post('/register',routes.insert_register_creds);


app.get('/dashboard', checkAuth, routes.dashboard);

app.get('/problems/:problem_number?', checkAuth, routes.prob_single);

app.get('/submit/:problem_number?', checkAuth, routes.submit_problem);

app.post('/submit/:problem_number?', checkAuth, routes.upload);

app.get('/submission/:problem_number?', checkAuth, routes.submission_module);

app.get('*', routes.notFound);


// Listen on port 3000
app.listen(process.env.PORT || 3000);
