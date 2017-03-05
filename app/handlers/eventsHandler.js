const jwt = require('jsonwebtoken'),
  config = require("../../config").config(),
  errors = require("../helpers/errors"),
  User = require("../models/user"),
  Event = require("../models/event"),
  Invitation = require("../models/invitation"),
  mongoose = require('mongoose'),
  { isString } = require('lodash');


/**
 * @api {post} /api/events Create new event
 * @apiName event_create
 * @apiGroup Events
 * @apiVersion 0.1.0
 *
 * @apiParam {String} title Event title
 * @apiParam {String} description Event description
 * @apiParam {String} creator Event creator
 * @apiParam {Date} date_time Event dateTime
 * @apiParam {String[]} invitations Event invitations
 *
 * @apiSuccessExample Success-Response
 *    HTTP/1.1 201 Created
 *    {
 *      token:  '12345abcdef',
 *      event: {
 *        _id: event._id,
 *        title: "Event Title",
 *        description: "Event Description",
 *        date_time: "19-8-2017 19:30"
 *      }
 *    }
 *
 *
 * @apiError ErrorInEvent Event couldn't be created
 *
 * @apiErrorExample Error-Response
 *    HTTP/1.1 400 Bad Request
 *    {
 *      code: 1000000,
 *      message: "Can't create new event.",
 *      detail: {},
 *      errors: []
 *    }
 *
 */

function createEvent(req, res) {
	const event = new Event();
	event.title = req.body.title;
	event.description = req.body.description;
  event.date_time = new Date(req.body.date_time);

  if (!isString(req.body.creator)) {
    assignCreatorAndSave(event, req.body.creator)
  } else {
    console.log(req.body.creator);
    event.creator = User.findById(req.body.creator, (err, creator) => assignCreatorAndSave(event, creator));
  }

  req.body.invitations.forEach(function (invitationParam) {
    const invitation = new Invitation();
    invitation.event = event;
    invitation.recipient = new User();
    if (!isString(invitationParam.recipient)) {
  	  invitation.recipient = invitationParam.recipient;
    } else {
      invitation.recipient = User.findById(invitationParam.recipient, (err, recipient) => sendInvitation(invitation, recipient));
    }
  });
}

function assignCreatorAndSave(event, creator) {
 event.creator = creator;
 event.participants = [{ admin: true, user: creator }];

 console.log(event);

 event.save(function (err) {
   if (err) {
     console.log(err);
   };
 });
}

function sendInvitation(invitation, recipient) {
 invitation.recipient = recipient;

 invitation.save(function (err) {
   if (err) {
     // TODO Handle errors
   };
 });
}

/**
 * @api {put} /api/event Update event
 * @apiName event_update
 * @apiGroup Events
 * @apiVersion 0.1.0
 *
 * @apiHeader {String} x-access-token Users unique access token
 *
 * @apiParam {String} title Event title
 * @apiParam {String} description Event description
 *
 * @apiSuccessExample Success-Response
 *    HTTP/1.1 200 OK
 *    {
 *      message:  "Event updated!",
 *      event: {
 *        _id: event._id,
 *        title: 'Title',
 *        description: 'Description'
 *      }
 *    }
 *
 * @apiError CantEditDescritpion Can't edit description
 *
 * @apiErrorExample Error-Response
 *    HTTP/1.1 400 Bad Request
 *    {
 *      code: 1000200,
 *      message: "Can't edit user.",
 *      detail: {},
 *      errors: []
 *    }
 *
 */

function updateEvent(req, res) {
  const event = req.body.event;

  if (req.body.title) {
    event.title = req.body.title;
  }

  if (req.body.description) {
    event.title = req.body.description;
  }

  event.save(function (err, updatedEvent){
    if (err) {
        // TODO Handle error
    }
    res.json({
      message: "Event updated!",
      event: updatedEvent.asJson()
    });
  });
}

function addInvitee(req, res) {
  const event = req.body.event;
  const invitation = req.body.invitation;

  event.addParticipant(invitation.recipient);
}

function cancelInvitation(req, res) {
  const event = req.body.event;
  const invitation = req.body.invitation;
  invitation.confirmation_code = shortid.generate();

  event.removeParticipant(invitation.recipient);
  Invitation.changeInvitationCode(invitation.confirmation_code, function (err, user) {
    if (err)
      // handle error

    res.json({
      message: "Invitation cancelled."
    });
  });
}

exports.createEvent = createEvent;
exports.updateEvent = updateEvent;
exports.addInvitee = addInvitee;
exports.cancelInvitation = cancelInvitation;
