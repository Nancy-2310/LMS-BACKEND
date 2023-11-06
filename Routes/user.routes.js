import { Router } from "express";
import { resetPassword, forgotPassword, login, logout, register } from "../Controllers/user.controller.js";
import upload from "../Middlewares/multer.middleware.js";

const router = Router();

router.post('/register',upload.single("avatar"), register);
// router.get('/me', getProfile);
router.post('/login',login);
router.post('/logout', logout);
router.post("/reset", forgotPassword)
router.post("/reset/:resetToken", resetPassword);
export default router;
