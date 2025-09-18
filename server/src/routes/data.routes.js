import express from "express";

import { getAllCrowd } from "../controllers/crowdController.js";
import { getAllCurrency } from "../controllers/currencyController.js";
import { getAllHotels } from "../controllers/hotelController.js";
import { getAllWeather } from "../controllers/weatherController.js";

const router = express.Router();

// Add requireApiKey as middleware if you want to protect these endpoints
router.get("/weather", /*requireApiKey,*/ getAllWeather);
router.get("/crowd", /*requireApiKey,*/ getAllCrowd);
router.get("/currency", /*requireApiKey,*/ getAllCurrency);
router.get("/hotels", /*requireApiKey,*/ getAllHotels);

export default router;
