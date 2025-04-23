import express from "express";
import { getCoordinatesFromAddress } from "../utils/geocodeLocation.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const coordinates = await getCoordinatesFromAddress(req.body);
    res.status(200).json({ coordinates });
  } catch (error) {
    console.error("Geocoding error:", error.message);
    res.status(500).json({ error: "Failed to fetch coordinates" });
  }
});

export default router;
