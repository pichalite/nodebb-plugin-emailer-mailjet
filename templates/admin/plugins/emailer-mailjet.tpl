<h1><i class="fa fa-envelope-o"></i> Emailer (Mailjet)</h1>

<div class="row">
	<div class="col-lg-12">
		<blockquote>
			<p>
				Mailjet is a programmable email platform. It allows your application to become a fully featured email server. Send, receive and track messages with ease.<br /><br />
			</p>
			
		</blockquote>
		<p>
			To get started:
		</p>
		<ol>
			<li>
				Register for an account on <a href="https://www.mailjet.com/signup">https://www.mailjet.com/signup</a>. Mailjet offers a free tier with up to 6,000 free emails monthly.
			</li>
			<li>
				Paste your API key and SECRET key into the fields below, hit save, and restart your NodeBB
			</li>
		</ol>
	</div>
</div>

<hr />

<form role="form" class="emailer-settings">
	<fieldset>
		<div class="row">
			<div class="col-sm-6">
				<div class="form-group">
					<label for="apiKey">API KEY</label>
					<input type="text" class="form-control" id="apiKey" name="apiKey" />
				</div>
			</div>
			<div class="col-sm-6">
				<div class="form-group">
					<label for="secretKey">SECRET KEY</label>
					<input type="text" class="form-control" id="secretKey" name="secretKey" />
				</div>
			</div>
		</div>

		<button class="btn btn-lg btn-primary" id="save" type="button">Save</button>
	</fieldset>
</form>

<script type="text/javascript">
	require(['settings'], function(Settings) {
		Settings.load('mailjet', $('.emailer-settings'));

		$('#save').on('click', function() {
			Settings.save('mailjet', $('.emailer-settings'), function() {
				app.alert({
					type: 'success',
					alert_id: 'mailjet-saved',
					title: 'Settings Saved',
					message: 'Click here to reload NodeBB',
					timeout: 2500,
					clickfn: function() {
						socket.emit('admin.reload');
					}
				});
			});
		});
	});
</script>