import { Router } from "express";
import {registerUser,loginUser, logoutUser} from "../controller/user.controller.js"

const router = Router()

router.route("/registar").post(registerUser);

router.route("/login").post(loginUser);

router.route("/logout").post(logoutUser)

export default router;