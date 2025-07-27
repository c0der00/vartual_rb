import { Router } from "express";
import {registerUser,loginUser, logoutUser, getCurrentUser} from "../controller/user.controller.js"
import { verifyJwt } from "../middelware/auth.middelware.js"

const router = Router()

router.route("/registar").post(registerUser);

router.route("/login").post(loginUser);

router.route("/logout").post(verifyJwt,logoutUser);

router.route("/current").get(verifyJwt,getCurrentUser);

export default router;