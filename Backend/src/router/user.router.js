import { Router } from "express";
import {registerUser,loginUser, logoutUser, getCurrentUser, updateAssistantDetails} from "../controller/user.controller.js"
import { verifyJwt } from "../middelware/auth.middelware.js"
import { upload } from '../middelware/multer.middelwares.js';

const router = Router()

router.route("/registar").post(registerUser);

router.route("/login").post(loginUser);

router.route("/logout").post(verifyJwt,logoutUser);

router.route("/current").get(verifyJwt,getCurrentUser);

router.route("/update").post(
    verifyJwt,
    upload.fields([
        { name: "assistantImage", maxCount: 1 }
    ]),
    updateAssistantDetails
);

export default router;