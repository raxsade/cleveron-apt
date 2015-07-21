var net = require('net');
var client = net.connect({port: 1337, host: '46.101.163.47'}, function() { //'connect' listener
	client.write('sade');
	console.log('connected to server!');
	// client.write('world!\r\n');
});
client.on('data', function(data) {
	console.log(data.toString());
	// client.end();
});
client.on('end', function() {
	console.log('disconnected from server');
});