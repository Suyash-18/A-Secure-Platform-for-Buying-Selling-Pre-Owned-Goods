import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import { DB_NAME } from "../constants.js";
import { v4 as uuidv4 } from "uuid";


// MongoDB connection
const MONGO_URI = 'mongodb://localhost:27017/A-Secure-Platform-for-Buying-Selling-Pre-Owned-Goods';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('DB connection error:', err);
    process.exit(1);
  }
};

// Constants
const NUM_USERS = 55;
const NUM_PRODUCTS = 200;
const PRODUCT_CONDITIONS = ["New", "Like New", "Used"];
const PRODUCT_STATUSES = ["available", "sold", "reserved"];
const PRODUCT_CATEGORIES = ["Electronics", "Furniture", "Books", "Clothing", "Toys", "Sports", "Appliances"];
const CITIES = [
  { city: "Pune", state: "Maharashtra", country: "India", lat: 18.5204, lng: 73.8567 },
  { city: "Mumbai", state: "Maharashtra", country: "India", lat: 19.0760, lng: 72.8777 },
  { city: "Bangalore", state: "Karnataka", country: "India", lat: 12.9716, lng: 77.5946 },
  { city: "Delhi", state: "Delhi", country: "India", lat: 28.6139, lng: 77.2090 }
];

// Define schemas (match your existing models)
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  fullname: String,
  avatar: String,
  coverImage: String,
  watchHistory: [mongoose.Schema.Types.ObjectId],
  password: String,
  refreshToken: String
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  condition: String,
  status: String,
  images: [{
    public_id: String,
    url: String
  }],
  category: String,
  location: {
    address: String,
    city: String,
    state: String,
    country: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);

// Generate users
const generateUsers = () => {
  return Array.from({ length: NUM_USERS }).map(() => {
    return new User({
      username: faker.internet.username().toLowerCase(),
      email: faker.internet.email().toLowerCase(),
      fullname: faker.person.fullName(),
      avatar: faker.image.avatar(),
      coverImage: faker.image.url(),
      watchHistory: [],
      password: faker.internet.password(),
      refreshToken: uuidv4()
    });
  });
};

// Generate products
const generateProducts = (sellers) => {
  return Array.from({ length: NUM_PRODUCTS }).map(() => {
    const seller = sellers[Math.floor(Math.random() * sellers.length)];
    const cityInfo = CITIES[Math.floor(Math.random() * CITIES.length)];
    return new Product({
      title: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price(10, 1000)),
      condition: PRODUCT_CONDITIONS[Math.floor(Math.random() * PRODUCT_CONDITIONS.length)],
      status: PRODUCT_STATUSES[Math.floor(Math.random() * PRODUCT_STATUSES.length)],
      images: [{
        public_id: uuidv4(),
        url: faker.image.url()
      }],
      category: PRODUCT_CATEGORIES[Math.floor(Math.random() * PRODUCT_CATEGORIES.length)],
      location: {
        address: faker.location.streetAddress(),
        city: cityInfo.city,
        state: cityInfo.state,
        country: cityInfo.country,
        coordinates: {
          lat: cityInfo.lat,
          lng: cityInfo.lng
        }
      },
      seller: seller._id
    });
  });
};

// Seed data
const seedData = async () => {
  await connectDB();

  try {
    await User.deleteMany();
    await Product.deleteMany();

    const users = generateUsers();
    await User.insertMany(users);
    console.log('Inserted users');

    const sellers = users.slice(0, Math.floor(NUM_USERS * 0.6));
    const products = generateProducts(sellers);
    await Product.insertMany(products);
    console.log('Inserted products');

  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    mongoose.disconnect();
    console.log('MongoDB disconnected');
  }
};

seedData();