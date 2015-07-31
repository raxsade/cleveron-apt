var net = require('net');
var _ = require('lodash');

var config = require('./config.json');

// possible prefixes for responses by the server
var responsePrefixes = ['S: {', 'E: {', 'C: {'];
// the current APT data
var currentData;

var client = net.connect(config.server);

client.on('connect', function () {
	client.write(config.apiKey);
	// pull command
	client.write('pull');
});
client.on('data', function (chunk) {
	handleResponses(chunk.toString());
});
client.on('end', function () {
	console.log('disconnected from server');
});

/**
	Handles responses.
	Since server buffer may be smaller than response size,
	creates a queue of response chunks and when response
	is complete, handles it according to its prefix.
*/
function handleResponsesClosure () {

	// create closure to remember the response chunks queue
	var chunks = '';

	return function (newChunk) {

		console.log(newChunk);

		var startsWithPrefix = responsePrefixes.indexOf(newChunk.slice(0,4)) > -1;
		// if new response chunk starts with responsePrefix then discard the old chunks queue
		chunks = startsWithPrefix ? newChunk : chunks + newChunk;

		try {
			// response prefix 'E' throws an error
			if ('E' === chunks[0]) {
				throw(chunks);
			};

			// try to parse chunks, catch error if fails
			// if succeeds (response is complete) then handle according to prefix
			var responseObject = JSON.parse(chunks.slice(3));

			// response prefix 'S' as a response to "pull" command
			if ('S' === chunks[0]) {
				currentData = responseObject;
			};

			// response prefix 'C' - changed data
			if ('C' === chunks[0]) {
				// find the object to change in the currentData
				var objectToChange = _.find(currentData[responseObject.collection], function (obj) {
					return obj.id === responseObject.id;
				});
				// overwrite changed properties
				_.extend(objectToChange, responseObject.change);
			};

			console.log(currentData);

		} catch(e) {
			console.log(e);
		}
	}
}

var handleResponses = handleResponsesClosure();