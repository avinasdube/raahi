import { Router } from "express";
import {
  login,
  logout,
  signup,
  updateMe,
} from "../controllers/authController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";
import {
  validateLogin,
  validateSignup,
} from "../middlewares/validationMiddleware.js";

const router = Router();

router.post("/signup", validateSignup, signup);
router.post("/login", validateLogin, login);
router.get("/logout", logout);
router.get("/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});
router.put("/update", requireAuth, updateMe);

export default router;
