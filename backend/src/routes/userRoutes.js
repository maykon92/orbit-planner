import express from "express";
import { getPublicProfile } from "../controllers/userController.js";

const router = express.Router();

router.get("/:id", getPublicProfile);

export default router;