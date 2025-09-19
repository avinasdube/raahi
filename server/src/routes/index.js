import { Router } from "express";

import aiRouter from "./ai.routes.js";
import authRouter from "./auth.routes.js";
import dataRouter from "./data.routes.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/", dataRouter);
router.use("/ai", aiRouter);

export default router;
