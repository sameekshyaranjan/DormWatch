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
    contactPhone: "+91 98XX XX 3210",
    images: ["https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80"],
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
    contactPhone: "+91 98XX XX 3211",
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
    contactPhone: "+91 98XX XX 3212",
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
    contactPhone: "+91 98XX XX 3213",
    images: ["https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80"],
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
    contactPhone: "+91 98XX XX 3214",
    images: ["https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=800&q=80"],
    latitude: 12.9698,
    longitude: 77.7499,
    trustScore: 98,
    trustScoreLabel: "Safe",
    trustScoreColor: "green",
    totalReports: 0
  },
  {
    name: "NestAway Indiranagar Hub",
    address: "100 Feet Road, Indiranagar",
    city: "Bangalore",
    description: "Vibrant living space in the heart of Indiranagar. Walkable to cafes and metro.",
    amenities: ["WiFi", "AC", "Laundry", "Lounge", "Security Camera"],
    totalRooms: 45,
    occupiedRooms: 40,
    pricePerMonth: 18000,
    contactPhone: "+91 98XX XX 3301",
    images: ["https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80"],
    latitude: 12.9784,
    longitude: 77.6408,
    trustScore: 85,
    trustScoreLabel: "Safe",
    trustScoreColor: "green",
    totalReports: 1
  },
  {
    name: "HSR Layout Co-live",
    address: "Sector 2, HSR Layout",
    city: "Bangalore",
    description: "Spacious and green co-living property with a rooftop garden and 24/7 power backup.",
    amenities: ["WiFi", "Rooftop", "Power Backup", "Meals", "Housekeeping"],
    totalRooms: 60,
    occupiedRooms: 55,
    pricePerMonth: 13500,
    contactPhone: "+91 98XX XX 3302",
    images: ["https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=800&q=80"],
    latitude: 12.9121,
    longitude: 77.6446,
    trustScore: 95,
    trustScoreLabel: "Safe",
    trustScoreColor: "green",
    totalReports: 0
  },
  {
    name: "Jayanagar Scholars Hostel",
    address: "4th Block, Jayanagar",
    city: "Bangalore",
    description: "Quiet and disciplined environment suitable for students preparing for exams.",
    amenities: ["WiFi", "Meals", "Library", "Security Camera"],
    totalRooms: 50,
    occupiedRooms: 48,
    pricePerMonth: 9500,
    contactPhone: "+91 98XX XX 3303",
    images: ["https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=800&q=80"],
    latitude: 12.9299,
    longitude: 77.5824,
    trustScore: 80,
    trustScoreLabel: "Safe",
    trustScoreColor: "green",
    totalReports: 3
  },
  {
    name: "Malleshwaram Heritage PG",
    address: "8th Cross, Malleshwaram",
    city: "Bangalore",
    description: "Traditional style PG with excellent home-cooked food and friendly owners.",
    amenities: ["Meals", "WiFi", "Washing Machine"],
    totalRooms: 20,
    occupiedRooms: 15,
    pricePerMonth: 7500,
    contactPhone: "+91 98XX XX 3304",
    images: ["https://images.unsplash.com/photo-1499955085172-a104c9463ece?auto=format&fit=crop&w=800&q=80"],
    latitude: 13.0031,
    longitude: 77.5643,
    trustScore: 90,
    trustScoreLabel: "Safe",
    trustScoreColor: "green",
    totalReports: 0
  },
  {
    name: "Bellandur Tech-Stay",
    address: "Outer Ring Road, Bellandur",
    city: "Bangalore",
    description: "Modern facility right next to major tech parks. High speed internet included.",
    amenities: ["WiFi", "AC", "Gym", "Meals", "Housekeeping"],
    totalRooms: 120,
    occupiedRooms: 110,
    pricePerMonth: 15000,
    contactPhone: "+91 98XX XX 3305",
    images: ["https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=800&q=80"],
    latitude: 12.9304,
    longitude: 77.6784,
    trustScore: 65,
    trustScoreLabel: "Caution",
    trustScoreColor: "yellow",
    totalReports: 8
  },
  {
    name: "Yelahanka Student Housing",
    address: "New Town, Yelahanka",
    city: "Bangalore",
    description: "Spacious rooms with natural lighting and cross ventilation.",
    amenities: ["WiFi", "Power Backup", "Security Camera"],
    totalRooms: 40,
    occupiedRooms: 30,
    pricePerMonth: 8000,
    contactPhone: "+91 98XX XX 3306",
    images: ["https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80"],
    latitude: 13.1007,
    longitude: 77.5963,
    trustScore: 88,
    trustScoreLabel: "Safe",
    trustScoreColor: "green",
    totalReports: 1
  },
  {
    name: "JP Nagar Comforts",
    address: "6th Phase, JP Nagar",
    city: "Bangalore",
    description: "Well maintained PG with separate study areas and regular cleaning.",
    amenities: ["WiFi", "Meals", "Housekeeping", "Washing Machine"],
    totalRooms: 35,
    occupiedRooms: 32,
    pricePerMonth: 10000,
    contactPhone: "+91 98XX XX 3307",
    images: ["https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=800&q=80"],
    latitude: 12.9063,
    longitude: 77.5857,
    trustScore: 94,
    trustScoreLabel: "Safe",
    trustScoreColor: "green",
    totalReports: 0
  },
  {
    name: "Rajajinagar Executive Stay",
    address: "Near Navrang Theatre, Rajajinagar",
    city: "Bangalore",
    description: "Premium single and double sharing rooms with attached bathrooms.",
    amenities: ["WiFi", "AC", "TV", "Meals", "Power Backup"],
    totalRooms: 25,
    occupiedRooms: 20,
    pricePerMonth: 11500,
    contactPhone: "+91 98XX XX 3308",
    images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80"],
    latitude: 12.9982,
    longitude: 77.5530,
    trustScore: 78,
    trustScoreLabel: "Caution",
    trustScoreColor: "yellow",
    totalReports: 4
  },
  {
    name: "Banashankari Budget PG",
    address: "2nd Stage, Banashankari",
    city: "Bangalore",
    description: "Economical stay option with basic amenities and decent food quality.",
    amenities: ["Meals", "Washing Machine"],
    totalRooms: 45,
    occupiedRooms: 42,
    pricePerMonth: 5500,
    contactPhone: "+91 98XX XX 3309",
    images: ["https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80"],
    latitude: 12.9255,
    longitude: 77.5468,
    trustScore: 40,
    trustScoreLabel: "Unsafe",
    trustScoreColor: "red",
    totalReports: 15
  },
  {
    name: "R.T. Nagar Modern Co-live",
    address: "Near CBI Road, R.T. Nagar",
    city: "Bangalore",
    description: "A newly renovated property offering a mix of private and shared rooms.",
    amenities: ["WiFi", "Housekeeping", "Security Camera", "Lounge"],
    totalRooms: 60,
    occupiedRooms: 30,
    pricePerMonth: 9000,
    contactPhone: "+91 98XX XX 3310",
    images: ["https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=800&q=80"],
    latitude: 13.0247,
    longitude: 77.5948,
    trustScore: 96,
    trustScoreLabel: "Safe",
    trustScoreColor: "green",
    totalReports: 0
  },
  {
    name: "Kammanahalli Global Stay",
    address: "CMR Road, Kammanahalli",
    city: "Bangalore",
    description: "Located in a cosmopolitan area, featuring international standard amenities.",
    amenities: ["WiFi", "AC", "Gym", "Meals"],
    totalRooms: 55,
    occupiedRooms: 45,
    pricePerMonth: 12500,
    contactPhone: "+91 98XX XX 3311",
    images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80"],
    latitude: 13.0159,
    longitude: 77.6380,
    trustScore: 89,
    trustScoreLabel: "Safe",
    trustScoreColor: "green",
    totalReports: 1
  },
  {
    name: "Kengeri Satellite Town PG",
    address: "Near Shirke Apartments, Kengeri",
    city: "Bangalore",
    description: "Peaceful environment, slightly away from city traffic. Ideal for students.",
    amenities: ["WiFi", "Meals", "Power Backup"],
    totalRooms: 30,
    occupiedRooms: 25,
    pricePerMonth: 7000,
    contactPhone: "+91 98XX XX 3312",
    images: ["https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80"],
    latitude: 12.9177,
    longitude: 77.4838,
    trustScore: 91,
    trustScoreLabel: "Safe",
    trustScoreColor: "green",
    totalReports: 0
  },
  {
    name: "Yeshwanthpur Transit Housing",
    address: "Near Railway Station, Yeshwanthpur",
    city: "Bangalore",
    description: "Conveniently located for frequent travelers. Flexible rental terms.",
    amenities: ["WiFi", "Housekeeping", "Security Camera"],
    totalRooms: 70,
    occupiedRooms: 60,
    pricePerMonth: 8500,
    contactPhone: "+91 98XX XX 3313",
    images: ["https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=800&q=80"],
    latitude: 13.0285,
    longitude: 77.5409,
    trustScore: 68,
    trustScoreLabel: "Caution",
    trustScoreColor: "yellow",
    totalReports: 6
  },
  {
    name: "Hebbal Lakeside Living",
    address: "Outer Ring Road, Hebbal",
    city: "Bangalore",
    description: "Premium property offering scenic views of Hebbal Lake and great facilities.",
    amenities: ["WiFi", "AC", "Gym", "Lounge", "Meals"],
    totalRooms: 90,
    occupiedRooms: 80,
    pricePerMonth: 17000,
    contactPhone: "+91 98XX XX 3314",
    images: ["https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80"],
    latitude: 13.0354,
    longitude: 77.5988,
    trustScore: 97,
    trustScoreLabel: "Safe",
    trustScoreColor: "green",
    totalReports: 0
  },
  {
    name: "Basavanagudi Scholar's Inn",
    address: "Gandhi Bazaar Main Road, Basavanagudi",
    city: "Bangalore",
    description: "Historic locality with access to amazing local eateries and parks.",
    amenities: ["WiFi", "Washing Machine", "Power Backup"],
    totalRooms: 20,
    occupiedRooms: 18,
    pricePerMonth: 8000,
    contactPhone: "+91 98XX XX 3315",
    images: ["https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=800&q=80"],
    latitude: 12.9406,
    longitude: 77.5738,
    trustScore: 82,
    trustScoreLabel: "Safe",
    trustScoreColor: "green",
    totalReports: 2
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
