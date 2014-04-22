/* GET users listing. */
exports.sendmail = function(req, res) {
	console.log(req.body);
	var token = req.body.token;
	var projectId = req.body.projectId;
	var https = require("https");
	var payload = {
	    "emails": req.body,
	    "apiKey": req.body.apiKey
	};
	var req_json = {
	    "tasks": [{
	        "code_name": 'sendmail',
	        "payload": JSON.stringify(payload)
	    }]
	};
	// Convert the JSON data
	var req_data = JSON.stringify(req_json);

	// Create the request headers
	var headers = {
	    'Authorization': 'OAuth ' + token,
	    'Content-Type': "application/json"
	};
	// Build config object for https.request
	var endpoint = {
	    "host": "worker-aws-us-east-1.iron.io",
	    "port": 443,
	    "path": "/2/projects/" + projectId + "/tasks",
	    "method": "POST",
	    "headers": headers
	};
	var post_req = https.request(endpoint, function(res) {
	    console.log("statusCode: ", res.statusCode);

	    res.on('data', function(d) {
	        process.stdout.write(d);
	    });
	});
	post_req.write(req_data)
	post_req.end();
	post_req.on('error', function(e) {
	    console.error(e);
	});
};