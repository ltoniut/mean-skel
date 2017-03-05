var jwt = require("jsonwebtoken"),
  config = require("../../config").config(),
  errors = require("../helpers/errors"),
  User = require("../models/user"),
  Event = require("../models/event"),
  Invitation = require("../models/invitation");

  /**
   * @api {post} /api/invitations Accept invitation
   * @apiName event_create
   * @apiGroup Invitations
   * @apiVersion 0.1.0
   *
   * @apiParam {String} code Invitation code
   *
   * @apiSuccessExample Success-Response
   *    HTTP/1.1 202 Accepted
   *    {
   *      message: "Invitation accepted."
   *    }
   *
   *
   * @apiError ErrorInEvent Event couldn't be created
   *
   * @apiErrorExample Error-Response
   *    HTTP/1.1 400 Bad Request
   *    {
   *      message: "Invitation failed."
   *    }
   *
   */

function acceptInvitation(code, res) {
  Invitation.acceptInvitation(code, function(err, user) {
    if (err)
      // handle error

    res.json({
      message: "Invitation accepted."
    });
  });
}

function changeInvitationCode(code, res) {
  Invitation.changeInvitationCode(code, function(err, user) {
    if (err)
      // handle error

    res.json({
      message: "Invitation cancelled."
    });
  });
}

exports.acceptInvitation = acceptInvitation;
exports.changeInvitationCode = changeInvitationCode;
