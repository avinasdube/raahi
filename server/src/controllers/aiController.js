import Crowd from "../models/Crowd.js";
import Hotel from "../models/Hotel.js";
import POI from "../models/POI.js";
import Weather from "../models/Weather.js";
import { callLLMWithPlanPrompt } from "../services/aiProvider.js";

const SYSTEM =
  "You are Raahi, an India-first travel assistant. Reply ONLY in JSON that matches the provided schema. Keep suggestions specific, safe, and budget-conscious.";

function deterministicPlan({
  city,
  days,
  budget,
  interests,
  season,
  hotels,
  pois,
  weather,
  crowd,
}) {
  const dailyBudget = Math.max(
    1,
    Math.round((budget || 0) / Math.max(1, days))
  );
  const poiNames = pois.map((p) => p.name);
  const items = Array.from({ length: days }, (_, idx) => ({
    day: idx + 1,
    morning: poiNames[idx % Math.max(1, poiNames.length)] || "City walk",
    afternoon: interests?.includes("Food & cafes")
      ? "Local food tour"
      : poiNames[(idx + 1) % Math.max(1, poiNames.length)] ||
        "Museum/Cultural spot",
    evening: interests?.includes("Shopping")
      ? "Bazaar & handicrafts"
      : "Sunset point",
    tips: [
      season === "Summer" ? "Carry water and start early." : null,
      season === "Monsoon" ? "Keep rain protection handy." : null,
      crowd ? `Crowd: ${crowd.crowd_level || crowd.level || crowd}` : null,
    ].filter(Boolean),
    transport:
      city === "Delhi"
        ? "Metro + cabs"
        : city === "Goa"
        ? "Scooter + cabs"
        : "Cabs + walking",
  }));

  const affordableHotels = hotels
    .filter(
      (h) =>
        (h.location || "").toLowerCase().includes((city || "").toLowerCase()) &&
        (h.available ?? true) &&
        (h.price || 0) <= dailyBudget * 0.4
    )
    .slice(0, 5)
    .map((h) => ({ name: h.name, price: h.price, location: h.location }));

  const summary = `A ${days}-day plan for ${city} with daily budget ~₹${dailyBudget}. Weather: ${
    weather ? `${weather.condition}, ${weather.temperature}°C` : "N/A"
  }.`;

  return { summary, hotels: affordableHotels, days: items, warnings: [] };
}

function buildUserPrompt(payload, data) {
  const {
    city,
    startDate,
    days,
    travelers,
    interests = [],
    budget,
    constraints = [],
    season,
  } = payload;
  const { weather, crowd, hotels, pois } = data;
  const schema = {
    summary: "string",
    hotels: [
      {
        name: "string",
        price: "number",
        location: "string",
      },
    ],
    days: [
      {
        day: "number",
        morning: "string",
        afternoon: "string",
        evening: "string",
        tips: ["string"],
        transport: "string",
      },
    ],
    warnings: ["string"],
  };

  const guidance = `Return ONLY valid JSON (no markdown). Fields must match this schema exactly: ${JSON.stringify(
    schema
  )}.`;

  const context = {
    city,
    startDate,
    days,
    travelers,
    interests,
    budget,
    constraints,
    season,
    weather,
    crowd,
    hotels: hotels.slice(0, 20),
    pois: pois.slice(0, 30),
  };

  return `${guidance}\nUse this context to plan:\n${JSON.stringify(context)}`;
}

export async function planTrip(req, res) {
  try {
    const {
      city,
      startDate,
      days,
      travelers,
      interests = [],
      budget = 15000,
      constraints = [],
      season,
    } = req.body || {};
    if (!city || !days) {
      return res.status(400).json({ message: "city and days are required" });
    }

    // Fetch live data
    const [weatherList, crowdList, hotels, pois] = await Promise.all([
      Weather.find(),
      Crowd.find(),
      Hotel.find(),
      POI.find({ city: new RegExp(city, "i") }),
    ]);
    const weather = weatherList.find(
      (w) => w.city?.toLowerCase() === city.toLowerCase()
    );
    const crowd =
      crowdList.find((c) => c.place?.toLowerCase() === city.toLowerCase()) ||
      null;

    // Build prompt
    const provider = process.env.LLM_PROVIDER || "off"; // e.g., "openai"
    const apiKey = process.env.LLM_API_KEY || process.env.OPENAI_API_KEY;
    const model = process.env.LLM_MODEL || "gpt-4o-mini";

    const userPrompt = buildUserPrompt(
      {
        city,
        startDate,
        days,
        travelers,
        interests,
        budget,
        constraints,
        season,
      },
      { weather, crowd, hotels, pois }
    );

    let content = null;
    if (provider && provider !== "off" && apiKey) {
      const resp = await callLLMWithPlanPrompt({
        provider,
        apiKey,
        model,
        prompt: userPrompt,
        system: SYSTEM,
      });
      if (resp.ok && resp.content) content = resp.content;
    }

    let plan;
    if (content) {
      try {
        plan = JSON.parse(content);
      } catch (e) {
        plan = deterministicPlan({
          city,
          days,
          budget,
          interests,
          season,
          hotels,
          pois,
          weather,
          crowd,
        });
      }
    } else {
      plan = deterministicPlan({
        city,
        days,
        budget,
        interests,
        season,
        hotels,
        pois,
        weather,
        crowd,
      });
    }

    return res.json(plan);
  } catch (err) {
    console.error("planTrip error", err);
    return res
      .status(500)
      .json({
        message: "Failed to generate plan",
        error: String(err?.message || err),
      });
  }
}
