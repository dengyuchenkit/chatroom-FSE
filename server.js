var express = require('express');
var app = express();
var pug = require('pug');

var server = require('http').createServer(app);
var io = require('socket.io')(server);

var mongoose = require('mongoose');
var schema = require('./schema');
mongoose.connect('mongodb://localhost:27017/test');
var Chat = mongoose.model('Chat', schema, 'chats');

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static('static'));

io.on('connection', function(client){
	client.on('chat', function(data) {
		console.log(data.name+' says: '+data.chat+'at '+data.time);
		var chat = data.name+'@'+data.time+": "+data.chat;
		client.broadcast.emit('message', chat);
	});
});

app.post('/enter', function(request, response){
	var name = request.body.name;
	console.log(name);
	response.send(name+' enters.');
});

app.get('/chatroom', function(requeset, response){
	Chat.find().sort({time:-1}).exec(function(err, docs) {
		var chats = []
		var compiledFunction = pug.compileFile('./chatroom.pug');
		for (const chat of docs) {
			var time = chat.time
			var formatTime = time.getHours() + ":" + time.getMinutes() + " " + time.getFullYear()  + "-" + (time.getMonth()+1) + "-" + time.getDate() ;
			chats.push(chat.name+"@"+formatTime+": "+chat.chat);
		}
		response.send(compiledFunction({chats: chats}));
	});
});

app.post('/chat', function(request, response) {
	console.log(request.body);
	var content = request.body.chatContent;
	var name = request.body.chatUser;
	var time = request.body.time;
	var chat = new Chat({
		name: name,
		chat: content,
		time: time
	}).save(function(err) {
		console.log(err);
	});
	response.send(name +" says: "+ content);
});

server.listen(8888);