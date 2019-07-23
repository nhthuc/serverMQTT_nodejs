var localhost;
var mosca = require('mosca');
var settings = {
		host:localhost,
		port:1883
		}

var server = new mosca.Server(settings);

server.on('ready', function(){
console.log("ready");
});

server.on('clientConnected', function(client) {
	
    console.log('client connected', client.id);
});

// In ra dòng chữ client disconnected và id của client khi có sự kiện client ngắt kết nối với server
server.on('clientDisconnected', function(client) {
    console.log('client disconnected', client.id);
});
