/*
 |--------------------------------------
 | Event Model
 |--------------------------------------
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    title: { type: String, require: true},
    location: { type: String, required: true},
    startDateTime: { type: Date, required: true},
    endDateTime: {type: Date, required: true},
    description: String,
    viewPublic: { type: Boolean, required: true},
})

module.exports = mongoose.model('Event', eventSchema);