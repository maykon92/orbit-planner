import express from "express";
import { getAppConfig } from "../controllers/configController.js";

const router = express.Router();

router.get("/", getAppConfig);

export default router;