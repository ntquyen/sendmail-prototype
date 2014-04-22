var mandrill = require('mandrill-api/mandrill');
var fs = require('fs');

var payloadIndex = -1;

process.argv.forEach(function(val, index, array) {
	if (val == "-payload") {
		payloadIndex = index + 1;
	}
});

if (payloadIndex == -1) {
	console.error("No payload argument");
	process.exit(1);
}

if (payloadIndex >= process.argv.length) {
	console.error("No payload value");
	process.exit(1);
}

fs.readFile(process.argv[payloadIndex], 'ascii', function(err, data) {
	if (err) {
		console.error("Could not open file: %s", err);
		process.exit(1);
	}
	var payload = JSON.parse(data);
	var mandrill_client = new mandrill.Mandrill(payload.api_key);
	var tos = [];
	for (var i = 0; i < payload.emails.receivers.length; i++) {
		var to = {
			"email": payload.emails.receivers[i].email,
			"name": payload.emails.receivers[i].name,
			"type": "to"
		}
		tos.push(to);
	};
	var message = {
		"html": "<p>Example HTML content</p>",
		"text": "Example text content",
		"subject": "example subject",
		"from_email": payload.emails.sender.email,
		"from_name": payload.emails.sender.name,
		"to": tos,
		"headers": {
			"Reply-To": payload.emails.sender.email
		},
		"important": false,
		"track_opens": null,
		"track_clicks": null,
		"auto_text": null,
		"auto_html": null,
		"inline_css": null,
		"url_strip_qs": null,
		"preserve_recipients": null,
		"view_content_link": null,
		"tracking_domain": null,
		"signing_domain": null,
		"return_path_domain": null,
		"merge": false,
		"tags": [
			"password-resets"
		],
		"metadata": {
			"website": "www.example.com"
		},
		"recipient_metadata": [{
			"rcpt": "recipient.email@example.com",
			"values": {
				"user_id": 123456
			}
		}]
	};
	var async = false;
	var ip_pool = "Main Pool";
	// var send_at = "example send_at";
	mandrill_client.messages.send({
		"message": message,
		"async": async,
	}, function(result) {
		console.log(result);
		/*
    [{
            "email": "recipient.email@example.com",
            "status": "sent",
            "reject_reason": "hard-bounce",
            "_id": "abc123abc123abc123abc123abc123"
        }]
    */
	}, function(e) {
		// Mandrill returns the error as an object with name and message keys
		console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
		// A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
	});

});