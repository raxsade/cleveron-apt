var net = require('net');
var API_KEY = 'sade';
var client = net.connect({port: 1337, host: '46.101.163.47'});
client.on('connect', function () {
	client.write(API_KEY);
	client.write('pull');
})
client.on('data', function (data) {
	handleResponses(data.toString());
});
client.on('end', function () {
	console.log('disconnected from server');
});

var responsePrefixes = ['S: {', 'E: {', 'C: {'];
function handleResponsesClosure () {
	var chunks = '';
	return function (newChunk) {
		console.log(newChunk);
		var startsWithPrefix = responsePrefixes.indexOf(newChunk.slice(0,4)) > -1;
		chunks = startsWithPrefix ? newChunk : chunks + newChunk;
		try {
			var jsonObject = JSON.parse(chunks.slice(3));
			console.log(jsonObject);
		} catch(e) {
			console.log(e);
		}
	}
}

var handleResponses = handleResponsesClosure();