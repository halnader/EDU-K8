var app = require('express')();
var http = require('http').Server(app);
var hbs = require('hbs');
var scriptPath = __dirname + '\\script.py';

app.set('view engine', 'html');
app.engine('html', require('hbs').__express);

var status = 'No Action';
var progress;

app.get('/', function(req,res){
	res.render(__dirname + '/index.html', {
		status: status
	});
})
app.get('/update', function(req, res) {	
	console.log('Initiated update');
	status = 'Initiated update';
	var PythonShell = require('python-shell');
	var pyshell = new PythonShell(scriptPath);
	
	pyshell.on('message', function (progress){
		console.log(progress);
		//res.status(200).redirect('/');
	})

	pyshell.end(function (err) {
		console.log('Done');
		status = 'Updated video library';
	    if (err){
	        throw err;
	    };
	    res.status(200).redirect('/');
	});
})

http.listen(3000, function() {
	console.log("Listening on port 3000");
})