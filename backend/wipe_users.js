require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const OTP = require('./models/OTP');

async function wipeDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected!');

    console.log('Deleting all users...');
    const userRes = await User.deleteMany({});
    console.log(`Deleted ${userRes.deletedCount} users.`);

    console.log('Deleting all OTPs...');
    const otpRes = await OTP.deleteMany({});
    console.log(`Deleted ${otpRes.deletedCount} OTPs.`);

    console.log('Done!');
    process.exit(0);
  } catch (err) {
    console.error('Error wiping database:', err);
    process.exit(1);
  }
}

wipeDatabase();
