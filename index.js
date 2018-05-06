var express = require('express');
var app = express();
var http = require('http').Server(app);
var hbs = require('hbs');
var fs = require('fs');
var path = require('path');

function checkInternet(cb) {
    require('dns').lookup('google.com',function(err) {
        if (err && err.code == "ENOTFOUND") {
            cb(false);
        } else {
            cb(true);
        }
    })
}

var scriptPath = __dirname + '\\script.py';

app.set('view engine', 'html');
app.engine('html', require('hbs').__express);
app.use(express.static(path.join(__dirname, 'public')));

var status = '';
var progress;

app.get('/', function(req,res){
	res.render(__dirname + '/courses.html', {
		status: status
	});
})

app.get('/back', function(req, res){
	res.status(200).redirect('/');
})

app.get(/c_/, function(req, res){
	str = (req.url).replace('/c_', '').replace('?', '').replace('_', ' ');
	var header = (str.charAt(0).toUpperCase()) + str.slice(1);
	let c = JSON.parse(fs.readFileSync('pageContent.json', 'utf8'));
	let index = -1;
	for(i=0; i<c.length;i++){
		if(c[i].name == header){
			index = i;
		}
	}
	if(index === -1){
		index = 0;
		c[index].content = [{"subTitle": "Sorry, this section is empty"}] 
	}
	res.render(__dirname + '/contentTemplate.html', {
		header: header,
		pageContent: c[index].content
	});
})


app.get('/video', function(req,res){
	res.render(__dirname + '/strong_interaction.html', {
	});
})

app.get('/update', function(req, res) {	
	console.log('Initiated update');
	checkInternet(function(isConnected) {
	    if (isConnected) {
			
			var PythonShell = require('python-shell');
			var pyshell = new PythonShell(scriptPath);
			
			pyshell.on('message', function (progress){
				console.log(progress);
			})

			pyshell.end(function (err) {
				console.log('Done');
				status = 'Updated video library';
				res.status(200).redirect('/');
			    if (err){
			        throw err;
			    };
			    
			});
		} else {
			status = "No internet";
			res.status(200).redirect('/');
	        console.log('No internet');
	    }
	});
	
	
})

http.listen(3000, function() {
	console.log("Listening on port 3000");
})