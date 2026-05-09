import express from "express";
import { authGuard } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.post("/", authGuard, upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No image uploaded." });
  }

  res.status(201).json({
    message: "Image uploaded successfully.",
    imageUrl: req.file.path,
    filename: req.file.filename,
  });
});

export default router;