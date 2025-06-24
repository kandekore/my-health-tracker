const { Schema, model } = require('mongoose');

const seizureSchema = new Schema({
  userId:     { type: String, required: true },        // wire auth later
  time:       { type: Date,   required: true },
  type:       { type: String, required: true },
  durationSec:{ type: Number, required: true },
}, { timestamps: true });

module.exports = model('Seizure', seizureSchema);
