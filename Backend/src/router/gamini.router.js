import { Router } from "express";
import { gaminiResponse } from "../controller/gamini.controller.js";
import { verifyJwt } from "../middelware/auth.middelware.js"

const router = Router();

router.route("/").post(verifyJwt,gaminiResponse);

export default router;