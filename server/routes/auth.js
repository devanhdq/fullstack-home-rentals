import {Router} from "express";
import {login, register, upload} from "../controllers/auth.controller.js";

const router = Router();
/* USER LOGIN*/
router.post("/login", login);

/*USER REGISTER*/
router.post("/register", upload.single("profileImage"), register);

export default router;