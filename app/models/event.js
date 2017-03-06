const mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  bcrypt = require('bcrypt-nodejs'),
  config = require('../../config').config(),
  fs = require('fs'),
  { drop, concat } = require('lodash');

// event schema
const EventSchema = new Schema({
  title: { type: String, required: "Title is required.", unique: true, minlength: [3, "Title should have at least 3 characters."], maxlength: [50, "Title should have at most 50 characters."] },
  description: { type: String, required: "Description is required.", select: false, minlength: [3, "Description should have at least 3 characters."], maxlength: [500, "Title should have at most 500 characters."] },
  creator: { type: Schema.Types.ObjectId, ref: 'User', required: "An event creator is required." },
  participants: [{
    admin: { type: Boolean, default: false, select: false },
    user: { type: Schema.Types.ObjectId, ref: 'User' }
  }],
  created_at: { type: Date, default: Date.now },
  date_time: { type: Date, required: "A scheduled date and time are required.", validate: [function (val) {return val.getTime() > new Date().getTime();}, 'Event date should be sometime after creation'] }
});

EventSchema.methods.addParticipant = function (user) {
  concat(this.participants, user);
}

EventSchema.methods.removeParticipant = function (user) {
  drop(this.participants, user);
}

module.exports = mongoose.model('Event', EventSchema);
