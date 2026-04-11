require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const User     = require('./models/User');
const Seizure  = require('./models/Seizure');
const KetoEntry = require('./models/KetoEntry');

const TEST_EMAIL    = 'test@test.com';
const TEST_PASSWORD = 'test1234';

async function main() {
  if (!process.env.MONGO_URL) throw new Error('MONGO_URL missing in .env');
  await mongoose.connect(process.env.MONGO_URL);
  console.log('Connected to MongoDB');

  let user = await User.findOne({ email: TEST_EMAIL });
  if (!user) {
    user = await User.create({
      email: TEST_EMAIL,
      name: 'Test User',
      passwordHash: await bcrypt.hash(TEST_PASSWORD, 10),
    });
    console.log(`Created user ${TEST_EMAIL}`);
  } else {
    console.log(`User ${TEST_EMAIL} already exists`);
  }

  const existing = await Seizure.countDocuments({ userId: user._id });
  if (existing === 0) {
    const now = Date.now();
    const day = 86_400_000;
    const types = ['Tonic-Clonic', 'Absence', 'Focal', 'Myoclonic'];

    const seizures = [];
    for (let i = 0; i < 10; i++) {
      seizures.push({
        userId: user._id,
        time: new Date(now - i * day - Math.random() * day),
        type: types[Math.floor(Math.random() * types.length)],
        durationSec: 10 + Math.floor(Math.random() * 120),
      });
    }
    await Seizure.insertMany(seizures);
    console.log(`Inserted ${seizures.length} sample seizures`);

    const keto = [];
    for (let i = 0; i < 14; i++) {
      const ketones = +(0.8 + Math.random() * 2.5).toFixed(2);
      const glucose = +(3.5 + Math.random() * 2).toFixed(2);
      keto.push({
        userId: user._id,
        time: new Date(now - i * day),
        carbsG: Math.floor(Math.random() * 20),
        fatG: 80 + Math.floor(Math.random() * 60),
        proteinG: 50 + Math.floor(Math.random() * 40),
        ketonesMmol: ketones,
        glucoseMmol: glucose,
      });
    }
    await KetoEntry.insertMany(keto);
    console.log(`Inserted ${keto.length} sample keto entries`);
  } else {
    console.log(`Skipping sample data — user already has ${existing} seizures`);
  }

  console.log('\nLogin with:');
  console.log(`  email:    ${TEST_EMAIL}`);
  console.log(`  password: ${TEST_PASSWORD}`);

  await mongoose.disconnect();
}

main().catch((e) => {
  console.error('Seed failed:', e);
  process.exit(1);
});
