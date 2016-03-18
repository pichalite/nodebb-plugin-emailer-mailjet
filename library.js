var winston = module.parent.require('winston');
var Meta = module.parent.require('./meta');

var Emailer = {};
var Mailjet = require('node-mailjet');
var server;

Emailer.init = function(params, callback) {
	function render(req, res, next) {
		res.render('admin/plugins/emailer-mailjet', {});
	}

	Meta.settings.get('mailjet', function(err, settings) {
		if (!err && settings && settings.apiKey && settings.secretKey) {
			server = Mailjet.connect(settings.apiKey, settings.secretKey);
		} else {
			winston.error('[plugins/emailer-mailjet] API key or SECRET Key not set!');
		}
	});

	params.router.get('/admin/plugins/emailer-mailjet', params.middleware.admin.buildHeader, render);
	params.router.get('/api/admin/plugins/emailer-mailjet', render);

	callback();
};

Emailer.send = function(data, callback) {
	if (!server) {
		winston.error('[emailer.mailjet] Mailjet is not set up properly!')
		return callback(null, data);
	}

	var sendEmail = server.post('send');
	var emailData = {
		'FromEmail': data.from,
		'FromName': data.from_name,
		'Subject': data.subject,
		'Text-part': data.plaintext,
		'Html-part': data.html,
		'Recipients': [{
			'Email': data.to
		}]
	};

	sendEmail
		.request(emailData)
		.on('success', handleSuccess)
		.on('error', handleError);

	function handleSuccess(data) {
		callback(null, data);
	}

	function handleError(err) {
		callback(err);
	}
};

Emailer.admin = {
	menu: function(custom_header, callback) {
		custom_header.plugins.push({
			"route": '/plugins/emailer-mailjet',
			"icon": 'fa-envelope-o',
			"name": 'Emailer (Mailjet)'
		});

		callback(null, custom_header);
	}
};

module.exports = Emailer;
