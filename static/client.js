var socket = io.connect('http://localhost:8888');
socket.on('message', function(data) {
	$("#chatList").prepend($('<li>',{text: data}));
	console.log('Receive a chat');
});

$(document).ready(function() {
	$("#dialog").dialog({
		buttons: {
			'Enter': function(){
				var name = $("#nameForm").serialize();
				if ($("#name").val().trim()!="") {
					$("#chatUser").val($("#name").val());
				}
				$.post('/enter', name, function(){
					console.log('Enter');
				});
				$(this).dialog('close');
			}
		}
	});
})

$(function(){
	$('#chatForm').on('submit', function(event) {
		console.log('submit form');
		event.preventDefault();
		var form = $(this);
		var chat = form.serializeArray();
		var time = new Date();
		var formatTime = time.getHours() + ":" + time.getMinutes() + " " + time.getFullYear()  + "-" + (time.getMonth()+1) + "-" + time.getDate() ;
		chat.push({name: 'time', value: time});
		console.log(chat);
		$.post('/chat', chat, function(data){
			$("#chatList").prepend($('<li>',{text:$("#chatUser").val()+'@'+formatTime+': '+$("#chatContent").val()}));
			form.trigger('reset');
		});
		socket.emit('chat', {name:$("#chatUser").val(), chat:$("#chatContent").val(), time: formatTime});
	});
});