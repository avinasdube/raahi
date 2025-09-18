import Currency from "../models/Currency.js";

export const getAllCurrency = async (req, res) => {
  try {
    const data = await Currency.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
