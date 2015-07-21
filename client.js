var net = require('net');
var client = net.connect({port: 1337, host: '46.101.163.47'}, function() { //'connect' listener
	client.write('sade');
	client.write('pull');
});
client.on('data', function(data) {
	console.log(data.toString());
	// client.end();
});
client.on('end', function() {
	console.log('disconnected from server');
});