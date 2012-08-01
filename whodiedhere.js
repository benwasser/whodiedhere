var express = require('express');
var http = require('http');
var io = require('socket.io');
var app = express();
var server = http.createServer(app);
var io = io.listen(server);
server.listen(80); //set this to whatever port you want to host this on

var fs = require("fs");
var deadlist = [];

io.set('log level', 1); //shuts up socket.io's debug output
io.set('transports', ['xhr-polling', 'jsonp-polling']); //chosen because we don't need anything fancy and these tend to work better
//you can typically leave out this ^ line but from trying a couple sites in production, you're going to run into problems with the defaults
//I think engine.io is going to be better for this as it starts with something like xhr and then upgrades to sockets
//here's what I think is the full list of transports:
//io.set('transports', [ 'websocket', 'flashsocket', 'htmlfile', 'xhr-polling', 'jsonp-polling']);

app.get('/', function (req, res) {
	res.sendfile(__dirname + '/whodiedhere.html');
});

fs.readFile(__dirname + '/whodiedhere.json', function (err, data) { 
	if (!err){
		deadlist = JSON.parse(data);
		console.log('deadlist file found')
	} else {
		console.log('deadlist file NOT found');
	};
});

io.sockets.on('connection', function (socket) {
	socket.on('search', function(term){
		if (term.length < 80){ //this may be problematic for searches for Lake Chargoggagoggmanchauggagoggchaubunagungamaugg
			console.log(term); //let's you see all the cascading searches for "poop" and "fart" that people enter
			socket.emit('results', 'Working...'); //let's the client know they don't need to frantically hit enter
			var temphtml = '<pre>'; //too lazy to set a monospace font clientside
			var dashes = '---------------------------------------------------------------------------------';
			var lcterm = term.toLowerCase();
			for (var i = 0; i < deadlist.length; i++){
				var lclisting = deadlist[i].toLowerCase();
				if (lclisting.indexOf(lcterm) > -1){
					var temparray = deadlist[i].split(' || ');
					var numdashes = 40 - temparray[0].length;
					temphtml += temparray[0] + ' ' + dashes.substr(0, numdashes) + '- ' + temparray[1] + '\n';
				}
			};
			if (temphtml == '<pre>'){
				temphtml = 'Sorry, no matches found';
			} else {
				temphtml+= '</pre>';
			};
			socket.emit('results', temphtml); //sends the html we've generated back to the client
		} else {
			socket.emit('results', 'Your query was too long');
		};
	});
});
