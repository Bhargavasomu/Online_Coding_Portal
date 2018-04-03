var http = require('http');
var fs = require('fs');
var url = require('url');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

function checkAuth(req, res, next)  // middleware Function To Check Authentication when visiting a page
{
    if(!req.session.user_id)
        res.send('You are not authorized to view this page');
    else
        next();
}

app.post('/login', function (req, res)
{
    var post = req.body;
    // console.log(JSON.stringify(post));
    // res.send("hello");
    console.log(post.uname);
    console.log(post.pswd);
    if(post.uname == 'john' && post.pswd == 'abcde')
    {
        // req.session.user_id = 1234;
        // res.write('User Found');
        res.redirect('/userHome');
    }
    else
    {
        res.writeHead(404);
        res.write('User Not Found');
    }
});

app.get('/userHome')

app.get('/',function(request,response)
{
    response.writeHead(200,{'Content-Type':'text/html'});
    renderHTML('./login.html',response);
})
app.listen(8000, () => console.log('Example app listening on port 8000!'))

function renderHTML(path,response)  // path has the path to the html file, Eg:- ./login.html
{
    fs.readFile(path,null,function(error , data)
    {
        if(error)
        {
            response.writeHead(404);
            response.write('File Not Found');
        }
        else
        {
            response.write(data);
        }
        response.end();
    });
}
// function onRequest(request,response)
// {
//     response.writeHead(200,{'Content-Type':'text/html'});
//     renderHTML('./login.html',response);
// }
// http.createServer(onRequest).listen(8000);
