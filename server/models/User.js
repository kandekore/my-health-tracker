const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  email:        { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  name:         { type: String, trim: true },
}, { timestamps: true });

module.exports = model('User', userSchema);
