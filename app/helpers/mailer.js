const config = require('../../config').config();
const sendgrid = require('sendgrid')(config.sendgrid.API_KEY);

function sendActivationEmail(user, done) {
	try {
		const link = config.base_url + "/activate/" + user.activation_token;

		const email     = new sendgrid.Email({
			to:       user.email,
			from:     'no-reply@meanskel.com',
			fromname: 'MEAN skel',
			subject:  'Please activate your account!',
			html:     "<p>Welcome! " + user.email + "</p><p>Please follow this link to activate your account</p><p><a href='" + link + "'>" + link + "</a></p>"
		});

		sendgrid.send(email, function (err, json) {
			if (err)
				done(err);
			else
				done(null);
		});
	}
	catch(err) {
	    done(err);
	}
}

function sendInvitationLink(invitation, done) {
	try {
		const link = config.base_url + "/event/" + invitation.code;
		const creator = invitation.event.creator;

		const email     = new sendgrid.Email({
			to:       invitation.recipient.email,
			from:     'no-reply@meanskel.com',
			fromname: 'MEAN skel',
			subject:  "Invitation for " + invitation.event.title + ".",
			html:     "Hello, " + invitation.recipient.firstname + ". You have been invited by " + creator.firstname + creator.lastname +
			" to participate in " + invitation.event.title + ". Click on the link below to confirm your assistance.</p><p><a href='" + link + "'>" + link + "</a></p>"
		});

		sendgrid.send(email, function (err, json) {
			if (err)
				done(err);
			else
				done(null);
		});
	}
	catch(err) {
	    done(err);
	}
}

exports.sendActivationEmail = sendActivationEmail;
exports.sendInvitationLink = sendInvitationLink;
