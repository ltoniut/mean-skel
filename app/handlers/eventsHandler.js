const jwt = require('jsonwebtoken'),
  config = require('../../config').config(),
  errors = require('../helpers/errors'),
  User = require('../models/user'),
  Event = require('../models/event'),
  shortid = require('shortid'),
  Invitation = require('../models/invitation'),
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
 *        title: 'Event Title',
 *        description: 'Event Description',
 *        date_time: '19-8-2017 19:30'
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
 *      message: 'Can't create new event.',
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
     throw err;
   };
 });
}

/**
 * @api {put} /api/event Update event
 * @apiName event_update
 * @apiGroup Events
 * @apiVersion 0.1.0
 *
 * @apiParam {String} id Event id
 * @apiParam {String} title Event title
 * @apiParam {String} description Event description
 *
 * @apiSuccessExample Success-Response
 *    HTTP/1.1 200 OK
 *    {
 *      message:  'Event updated!',
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
 *      message: 'Can't edit user.',
 *      detail: {},
 *      errors: []
 *    }
 *
 */

function updateEvent(req, res) {
  Event.findByIdAndUpdate( req.body.id, { title: req.body.title, description: req.body.description }, { new: true }, function (err, updatedEvent){

    if(err){
        console.log(err);
        console.log('Something wrong when updating data!');
        throw(err);
    }
  });

  res.json({
    message: 'Event updated!',
    event: updatedEvent.asJson()
  });
}

/**
 * @api {post} /api/event/invitations Add invitation
 * @apiName invitee_adding
 * @apiGroup Events
 * @apiVersion 0.1.0
 *
 * @apiParam {String} event Event id
 * @apiParam {String} recipient Recipient id
 *
 * @apiSuccessExample Success-Response
 *    HTTP/1.1 200 OK
 *    {
 *      message:  'Invitation sent!',
 *      event: {
 *        _id: event._id,
 *        invitation: invitation._id
 *      }
 *    }
 *
 * @apiError CantEditDescritpion Can't edit description
 *
 * @apiErrorExample Error-Response
 *    HTTP/1.1 400 Bad Request
 *    {
 *      code: 1000200,
 *      message: 'Can't edit user.',
 *      detail: {},
 *      errors: []
 *    }
 *
 */

function addInvitee(req, res) {
  const invitation = new Invitation();
  invitation.event = Event.findById(req.body.event, (err, targetEvent) => assignEvent(invitation, targetEvent, req.body.recipient));
}

function assignEvent(invitation, targetEvent, recipient) {
 invitation.event = targetEvent;
 invitation.recipient = User.findById(recipient, (err, recipient) => sendInvitation(invitation, recipient));
}

/**
 * @api {post} /api/event/invitation Cancel invitation
 * @apiName invitation_cancelling
 * @apiGroup Events
 * @apiVersion 0.1.0
 *
 * @apiParam {String} event Event id
 * @apiParam {String} user User id
 *
 * @apiSuccessExample Success-Response
 *    HTTP/1.1 200 OK
 *    {
 *      message:  'Invitation cancelled!',
 *      invitation: {
 *        _id: invitation._id,
 *        title: 'Event Title'
 *      }
 *    }
 *
 * @apiError CantRemoveInvitee Can't remove invitee
 *
 * @apiErrorExample Error-Response
 *    HTTP/1.1 400 Bad Request
 *    {
 *      code: 1000200,
 *      message: 'Can't edit user.',
 *      detail: {},
 *      errors: []
 *    }
 *
 */

function cancelInvitation(req, res) {
  console.log('Confirm')
  const newCode = shortid.generate();
  const invitation = Invitation.findOneAndUpdate( { recipient: req.body.user, event: req.body.event } , { confirmation_code: newCode } , { new: true }, function (err, cancellednvitation) {
    if(err){
        console.log(err);
        console.log('Something wrong when updating data!');
        throw(err);
    };

    const event = Event.update(
      { _id: req.body.event },
      { $pull: { 'participants' : { user : req.body.user } } },
      { new: true },
      function removeConnectionsCB(err, obj) {
        if(err){
            console.log(err);
            console.log('Something wrong when updating data!');
            throw(err);
        };
      });
  });
}



exports.createEvent = createEvent;
exports.updateEvent = updateEvent;
exports.addInvitee = addInvitee;
exports.cancelInvitation = cancelInvitation;
