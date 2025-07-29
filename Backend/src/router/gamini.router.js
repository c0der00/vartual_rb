import { Router } from "express";
import { gaminiResponse } from "../controller/gamini.controller.js";

const router = Router();

router.route("/").post(gaminiResponse);

export default router;