const { Schema, model } = require('mongoose');

const seizureSchema = new Schema({
  userId:     { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  time:       { type: Date,   required: true },
  type:       { type: String, required: true },
  durationSec:{ type: Number, required: true },
}, { timestamps: true });

module.exports = model('Seizure', seizureSchema);
