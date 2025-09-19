import { Router } from "express";
import { planTrip } from "../controllers/aiController.js";

const router = Router();

router.post("/plan", planTrip);

export default router;
