export const validateSignup = (req, res, next) => {
  const { email, password } = req.body;
  const name = req.body.name || req.body.fullName;
  if (!name || typeof name !== "string" || name.trim().length < 2)
    return res.status(400).json({ message: "Valid name is required" });
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(email)))
    return res.status(400).json({ message: "Valid email is required" });
  if (!password || String(password).length < 6)
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters" });
  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(email)))
    return res.status(400).json({ message: "Valid email is required" });
  if (!password)
    return res.status(400).json({ message: "Password is required" });
  next();
};
