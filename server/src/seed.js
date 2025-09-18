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
  for (let i = 0; i < 100; i++) {
    const city = faker.helpers.arrayElement(selectedCities);
    const hotelName = `${faker.helpers.arrayElement(
      hotelBrands
    )} ${city} Hotel`;
    hotelDocs.push({
      name: hotelName,
      location: city,
      price: faker.number.int({ min: 1200, max: 12000 }),
      rating: faker.number.float({ min: 2, max: 5, precision: 0.1 }),
      available: faker.datatype.boolean(),
    });
  }
  await Hotel.insertMany(hotelDocs);

  console.log("✅ Inserted 100 dummy docs for each model!");
  mongoose.disconnect();
}

main();
