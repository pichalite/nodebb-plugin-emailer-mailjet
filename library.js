var	fs = require('fs'),
	path = require('path'),

	winston = module.parent.require('winston'),
	Meta = module.parent.require('./meta'),

	Emailer = {},
	Mailjet = require('mailjet-sendemail'),
	server;

Emailer.init = function(params, callback) {
	function render(req, res, next) {
		res.render('admin/plugins/emailer-mailjet', {});
	}

	Meta.settings.get('mailjet', function(err, settings) {
		if (!err && settings && settings.apiKey && settings.secretKey) {
			server = new Mailjet(settings.apiKey,
				settings.secretKey
			);
		} else {
			winston.error('[plugins/emailer-mailjet] API key or SECRET Key not set!');
		}
	});

	params.router.get('/admin/plugins/emailer-mailjet',            params.middleware.admin.buildHeader, render);
	params.router.get('/api/admin/plugins/emailer-mailjet', render);

	callback();
};

Emailer.send = function(data) {
	if (!server) {
		return winston.error('[emailer.mailjet] Mailjet is not set up properly!')
	}

    server.sendContent(data.from,
         data.to,
         data.subject,
         'html',
         data.plaintext
         );

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