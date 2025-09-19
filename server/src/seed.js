import { faker } from "@faker-js/faker";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

// always load .env from project root
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import Crowd from "./models/Crowd.js";
import Currency from "./models/Currency.js";
import Hotel from "./models/Hotel.js";
import POI from "./models/POI.js";
import User from "./models/User.js";
import Weather from "./models/Weather.js";

const mongoUri =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/travelsarthi";

async function main() {
  try {
    await mongoose.connect(mongoUri);
    console.log("✅ MongoDB connected");
    await seed();
    process.exit(0);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
}

async function seed() {
  // Delete all data except users
  await Promise.all([
    Weather.deleteMany({}),
    Crowd.deleteMany({}),
    Currency.deleteMany({}),
    Hotel.deleteMany({}),
    POI.deleteMany({}),
    User.deleteMany({}), // Remove all users, but do not re-seed
  ]);

  // 1. Seed Weather Data (Only Agra, Varanasi, Manali, Jaipur, Goa)
  const selectedCities = ["Agra", "Varanasi", "Manali", "Jaipur", "Goa"];
  const weatherDocs = [];
  for (let i = 0; i < 100; i++) {
    const city = faker.helpers.arrayElement(selectedCities);
    weatherDocs.push({
      city,
      temperature: faker.number.int({ min: 5, max: 45 }),
      condition: faker.helpers.arrayElement([
        "Sunny",
        "Rain",
        "Cloudy",
        "Fog",
        "Storm",
        "Haze",
        "Thunderstorm",
      ]),
      humidity: faker.number.int({ min: 20, max: 95 }),
      forecast: Array.from({ length: 3 }, () => ({
        day: faker.date.weekday(),
        temp: faker.number.int({ min: 5, max: 45 }),
        condition: faker.helpers.arrayElement([
          "Sunny",
          "Rain",
          "Cloudy",
          "Fog",
        ]),
      })),
      last_updated: faker.date.recent(),
    });
  }
  await Weather.insertMany(weatherDocs);

  // 2. Seed Crowd Data (Places in selected cities)
  const crowdDocs = [];
  const cityPlaces = {
    Agra: ["Taj Mahal", "Agra Fort", "Mehtab Bagh"],
    Varanasi: ["Kashi Vishwanath Temple", "Dashashwamedh Ghat", "Sarnath"],
    Manali: ["Hadimba Temple", "Solang Valley", "Old Manali"],
    Jaipur: ["Hawa Mahal", "Amber Fort", "City Palace"],
    Goa: ["Baga Beach", "Fort Aguada", "Basilica of Bom Jesus"],
  };
  for (let i = 0; i < 100; i++) {
    const city = faker.helpers.arrayElement(selectedCities);
    const place = faker.helpers.arrayElement(cityPlaces[city]);
    crowdDocs.push({
      place: place,
      crowd_level: faker.helpers.arrayElement(["Low", "Medium", "High"]),
      percent: faker.number.int({ min: 10, max: 100 }),
      last_updated: faker.date.recent(),
    });
  }

  await Crowd.insertMany(crowdDocs);

  // 3. Seed Currency Data (INR as base)
  const currencyDocs = [];
  for (let i = 0; i < 100; i++) {
    currencyDocs.push({
      base: "INR",
      rates: {
        USD: faker.finance.amount(0.011, 0.013, 4), // INR to USD
        EUR: faker.finance.amount(0.01, 0.012, 4), // INR to EUR
        GBP: faker.finance.amount(0.009, 0.011, 4), // INR to GBP
        AED: faker.finance.amount(0.04, 0.045, 4), // INR to AED
        JPY: faker.finance.amount(1.6, 1.8, 2), // INR to JPY
      },
      last_updated: faker.date.recent(),
    });
  }
  await Currency.insertMany(currencyDocs);

  // 4. Seed Hotels Data (Only in selected cities)
  const hotelDocs = [];
  const hotelBrands = [
    "Taj",
    "Oberoi",
    "ITC",
    "Leela",
    "Trident",
    "Vivanta",
    "Radisson",
    "Hyatt",
    "Lemon Tree",
    "Fortune",
  ];
  // City center coordinates for a basic geo distribution
  const cityCenters = {
    Agra: { lat: 27.1767, lng: 78.0081 },
    Varanasi: { lat: 25.3176, lng: 82.9739 },
    Manali: { lat: 32.2396, lng: 77.1887 },
    Jaipur: { lat: 26.9124, lng: 75.7873 },
    Goa: { lat: 15.2993, lng: 74.124 },
  };
  for (let i = 0; i < 100; i++) {
    const city = faker.helpers.arrayElement(selectedCities);
    const hotelName = `${faker.helpers.arrayElement(
      hotelBrands
    )} ${city} Hotel`;
    const center = cityCenters[city];
    // jitter within ~5km
    const latOffset = faker.number.float({
      min: -0.045,
      max: 0.045,
      precision: 0.0001,
    });
    const lngOffset = faker.number.float({
      min: -0.045,
      max: 0.045,
      precision: 0.0001,
    });
    hotelDocs.push({
      name: hotelName,
      location: city,
      price: faker.number.int({ min: 1200, max: 12000 }),
      rating: faker.number.float({ min: 2, max: 5, precision: 0.1 }),
      available: faker.datatype.boolean(),
      image: faker.image.urlPicsumPhotos({ width: 1200, height: 800 }),
      amenities: faker.helpers.arrayElements(
        [
          "Reception",
          "Free Wifi",
          "Power backup",
          "AC",
          "CCTV",
          "Parking",
          "Elevator",
          "Restaurant",
        ],
        faker.number.int({ min: 3, max: 6 })
      ),
      reviews: faker.number.int({ min: 50, max: 1200 }),
      badge: faker.helpers.arrayElement(["Good", "Very Good", "Excellent"]),
      socialProof: `${faker.number.int({
        min: 3,
        max: 30,
      })} people booked this hotel today`,
      coords: {
        lat: Number((center.lat + latOffset).toFixed(6)),
        lng: Number((center.lng + lngOffset).toFixed(6)),
      },
    });
  }
  await Hotel.insertMany(hotelDocs);

  // 5. Seed POI Data (Points of Interest)
  const poiDocs = [
    // Jaipur POIs
    {
      name: "Hawa Mahal",
      city: "Jaipur",
      time: "9:00 AM",
      tip: "Best light in the morning.",
      category: "historical",
    },
    {
      name: "City Palace",
      city: "Jaipur",
      time: "11:00 AM",
      tip: "Combo ticket with Jantar Mantar.",
      category: "historical",
    },
    {
      name: "Amber Fort",
      city: "Jaipur",
      time: "3:00 PM",
      tip: "Stay for sunset views.",
      category: "historical",
    },

    // Goa POIs
    {
      name: "Baga Beach",
      city: "Goa",
      time: "10:00 AM",
      tip: "Water sports open by mid-morning.",
      category: "beach",
    },
    {
      name: "Fort Aguada",
      city: "Goa",
      time: "1:00 PM",
      tip: "Great sea views and photos.",
      category: "historical",
    },
    {
      name: "Candolim",
      city: "Goa",
      time: "5:30 PM",
      tip: "Beach shacks for sunset snacks.",
      category: "beach",
    },

    // Delhi POIs
    {
      name: "India Gate",
      city: "Delhi",
      time: "9:30 AM",
      tip: "Walk the lawns if weather permits.",
      category: "historical",
    },
    {
      name: "Qutub Minar",
      city: "Delhi",
      time: "12:00 PM",
      tip: "Carry water; open courtyards.",
      category: "historical",
    },
    {
      name: "Humayun's Tomb",
      city: "Delhi",
      time: "3:30 PM",
      tip: "Beautiful Mughal gardens.",
      category: "historical",
    },

    // Additional POIs for other cities
    {
      name: "Taj Mahal",
      city: "Agra",
      time: "8:00 AM",
      tip: "Visit early to avoid crowds.",
      category: "historical",
    },
    {
      name: "Agra Fort",
      city: "Agra",
      time: "11:00 AM",
      tip: "Explore the Mughal architecture.",
      category: "historical",
    },
    {
      name: "Fatehpur Sikri",
      city: "Agra",
      time: "2:00 PM",
      tip: "Ghost city with beautiful palaces.",
      category: "historical",
    },

    {
      name: "Kashi Vishwanath Temple",
      city: "Varanasi",
      time: "6:00 AM",
      tip: "Morning aarti is spectacular.",
      category: "religious",
    },
    {
      name: "Ganges River",
      city: "Varanasi",
      time: "7:00 AM",
      tip: "Boat ride at sunrise.",
      category: "religious",
    },
    {
      name: "Sarnath",
      city: "Varanasi",
      time: "10:00 AM",
      tip: "Where Buddha gave his first sermon.",
      category: "religious",
    },

    {
      name: "Rohtang Pass",
      city: "Manali",
      time: "9:00 AM",
      tip: "Stunning mountain views.",
      category: "nature",
    },
    {
      name: "Solang Valley",
      city: "Manali",
      time: "11:00 AM",
      tip: "Adventure activities available.",
      category: "nature",
    },
    {
      name: "Hadimba Temple",
      city: "Manali",
      time: "3:00 PM",
      tip: "Ancient wooden temple.",
      category: "religious",
    },
  ];
  await POI.insertMany(poiDocs);

  console.log("✅ Inserted dummy data for all models!");
  mongoose.disconnect();
}

main();
