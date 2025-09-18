import { Router } from "express";

import authRouter from "./auth.routes.js";
import dataRouter from "./data.routes.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/", dataRouter);

export default router;
