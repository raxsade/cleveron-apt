var net = require('net');
var _ = require('underscore');
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
var currentData;
function handleResponsesClosure () {
	var chunks = '';
	return function (newChunk) {
		console.log(newChunk);
		var startsWithPrefix = responsePrefixes.indexOf(newChunk.slice(0,4)) > -1;
		chunks = startsWithPrefix ? newChunk : chunks + newChunk;
		try {
			var jsonObject = JSON.parse(chunks.slice(3));

			// response prefix 'S' as a response to "pull" command
			if ('S' === chunks[0]) {
				currentData = jsonObject;
			};

			// response prefix 'C' - changed data
			if ('C' === chunks[0]) {
				var objectToChange = _.find(currentData[jsonObject.collection], function (obj) {
					return obj.id === jsonObject.id;
				});
				_.extend(objectToChange, jsonObject.change);
			};

			console.log(currentData);
		} catch(e) {
			console.log(e);
		}
	}
}

var handleResponses = handleResponsesClosure();