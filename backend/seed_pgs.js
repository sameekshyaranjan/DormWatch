require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Accommodation = require('./models/Accommodation');

const pgs = [
  {
    name: "Stanza Living - Magellan House",
    address: "Koramangala 5th Block, near Jyoti Nivas College",
    city: "Bangalore",
    description: "Premium student living with modern amenities and high security. Perfect for students and young professionals.",
    amenities: ["WiFi", "AC", "Laundry", "Gym", "Meals", "Security Camera"],
    totalRooms: 50,
    occupiedRooms: 45,
    pricePerMonth: 12000,
    contactPhone: "9876543210",
    images: ["https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80"],
    latitude: 12.9352,
    longitude: 77.6245,
    trustScore: 92,
    trustScoreLabel: "Safe",
    trustScoreColor: "green",
    totalReports: 2
  },
  {
    name: "Zolo Destiny",
    address: "BTM Layout Stage 2, next to Udupi Garden",
    city: "Bangalore",
    description: "Affordable and clean PG with 3-time meals and daily housekeeping.",
    amenities: ["WiFi", "Meals", "Housekeeping", "Power Backup"],
    totalRooms: 30,
    occupiedRooms: 20,
    pricePerMonth: 8500,
    contactPhone: "9876543211",
    images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80"],
    latitude: 12.9166,
    longitude: 77.6101,
    trustScore: 75,
    trustScoreLabel: "Caution",
    trustScoreColor: "yellow",
    totalReports: 5
  },
  {
    name: "Colive 176 - Campus View",
    address: "Electronic City Phase 1, near Infosys Campus",
    city: "Bangalore",
    description: "Tech-enabled co-living space with biometric access and modern lounge.",
    amenities: ["WiFi", "AC", "Security Camera", "Lounge", "Washing Machine"],
    totalRooms: 100,
    occupiedRooms: 90,
    pricePerMonth: 14000,
    contactPhone: "9876543212",
    images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80"],
    latitude: 12.8452,
    longitude: 77.6602,
    trustScore: 88,
    trustScoreLabel: "Safe",
    trustScoreColor: "green",
    totalReports: 1
  },
  {
    name: "Sri Sai Balaji Men's PG",
    address: "Marathahalli, near Kalamandir",
    city: "Bangalore",
    description: "Basic men's PG with food and accommodation. Close to IT parks.",
    amenities: ["Meals", "Washing Machine", "Power Backup"],
    totalRooms: 40,
    occupiedRooms: 38,
    pricePerMonth: 6500,
    contactPhone: "9876543213",
    images: ["https://images.unsplash.com/photo-1595526114101-11c97a89279a?auto=format&fit=crop&w=800&q=80"],
    latitude: 12.9569,
    longitude: 77.7011,
    trustScore: 45,
    trustScoreLabel: "Unsafe",
    trustScoreColor: "red",
    totalReports: 12
  },
  {
    name: "HelloWorld Whitefield",
    address: "Whitefield, behind ITPL",
    city: "Bangalore",
    description: "Co-living space designed for millennials with community events and game room.",
    amenities: ["WiFi", "Game Room", "Housekeeping", "Security Camera", "AC"],
    totalRooms: 80,
    occupiedRooms: 50,
    pricePerMonth: 16000,
    contactPhone: "9876543214",
    images: ["https://images.unsplash.com/photo-1502672260266-1c1cd2cb936c?auto=format&fit=crop&w=800&q=80"],
    latitude: 12.9698,
    longitude: 77.7499,
    trustScore: 98,
    trustScoreLabel: "Safe",
    trustScoreColor: "green",
    totalReports: 0
  }
];

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected!');

    console.log('Creating dummy owner...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    let owner = await User.findOne({ email: 'owner@safestay.com' });
    if (!owner) {
      owner = new User({
        name: 'SafeStay Admin Owner',
        email: 'owner@safestay.com',
        password: hashedPassword,
        role: 'owner',
        isVerified: true,
        ownerVerificationStatus: 'verified'
      });
      await owner.save();
    }
    
    console.log('Owner created. ID:', owner._id);

    console.log('Clearing old PGs...');
    await Accommodation.deleteMany({});

    console.log('Inserting Bangalore PGs...');
    for (let pg of pgs) {
      const acc = new Accommodation({
        ...pg,
        owner: owner._id,
        isVerified: true,
        location: {
          type: 'Point',
          coordinates: [pg.longitude, pg.latitude]
        }
      });
      await acc.save();
      console.log(`Inserted: ${pg.name}`);
    }

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
}

seedDatabase();
