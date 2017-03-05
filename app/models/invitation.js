const mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  bcrypt = require("bcrypt-nodejs"),
  shortid = require('shortid'),
  mailer = require("../helpers/mailer"),
  config = require("../../config").config(),
  fs = require('fs');

// invitation schema
const InvitationSchema = new Schema({
  event: { type: Schema.Types.ObjectId, ref: 'Event', required: "An event must be selected." },
  accepted: { type: Boolean, default: false, select: true },
  confirmation_code: { type: String, select: false, unique: true, 'default': shortid.generate }, // Code in link url for accepting the invitation
  recipient: { type: Schema.Types.ObjectId, ref: 'User', required: "A recipient must be selected." },
  created_at: { type: Date, default: Date.now },
  accepted_at: { type: Date, default: null }
});

// Send email with invitation code
InvitationSchema.post('save', function (invitation) {
  if (this.recipient.wasNew) {
    mailer.sendInvitationLink(invitation, function (error){
      // TODO: Handle error if exists
    });
  }
});

InvitationSchema.statics.acceptInvitation = function (code, callback) {
  // Confirm invitation code

  this.findOneAndUpdate({ confirmation_code: code, accepted_at: null }, { confirmation_code: shortid.generate(), accepted_at: Date.now, accepted: true }, { new: true }, function (err, invitation){
    console.log(invitation.confirmation_code);
    if(err){
        console.log("Something wrong when updating data!");
    }
    callback(err, invitation);
  });

  this.event.addParticipant(this.recipient);
};


InvitationSchema.statics.changeInvitationCode = function (code, callback) {
  // Confirm invitation code
  const new_code = shortid.generate();
  this.findOneAndUpdate({ confirmation_code: code }, { confirmation_code: new_code }, { new: true }, function (err, invitation){
    callback(err, invitation);
  });
};

module.exports = mongoose.model('Invitation', InvitationSchema);
