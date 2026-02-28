import express from "express";
import { Count } from "../models/Count.js";

const router = express.Router();

/**
 * POST → Save new count
 */
router.post("/update", async (req, res) => {
  try {
    const { value } = req.body;

    if (value === undefined) {
      return res.status(400).json({ message: "value is required" });
    }

    const doc = await Count.create({ value });
    res.status(201).json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET → Latest count (SAFE using _id)
 */
router.get("/latest", async (req, res) => {
  try {
    const latest = await Count.findOne().sort({ _id: -1 });
    res.json(latest || { value: 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * DEBUG → View all data (optional)
 */
router.get("/all", async (req, res) => {
  const all = await Count.find().sort({ _id: -1 });
  res.json(all);
});

export default router;