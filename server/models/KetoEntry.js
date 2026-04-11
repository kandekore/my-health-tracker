const { Schema, model } = require('mongoose');

const ketoSchema = new Schema({
  userId:       { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  time:         { type: Date, required: true },
  carbsG:       { type: Number, default: 0 },
  fatG:         { type: Number, default: 0 },
  proteinG:     { type: Number, default: 0 },
  ketonesMmol:  { type: Number },
  glucoseMmol:  { type: Number },
  notes:        { type: String, trim: true },
}, { timestamps: true });

// Glucose Ketone Index — lower is deeper ketosis. Requires both readings.
ketoSchema.virtual('gki').get(function () {
  if (this.glucoseMmol && this.ketonesMmol) {
    return +(this.glucoseMmol / this.ketonesMmol).toFixed(2);
  }
  return null;
});

ketoSchema.set('toJSON', { virtuals: true });

module.exports = model('KetoEntry', ketoSchema);
