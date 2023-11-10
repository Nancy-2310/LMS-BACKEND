import { Router } from "express";
import { resetPassword, forgotPassword, login, logout, register, getProfile, changePassword, updateUser } from "../Controllers/user.controller.js";
import { isLoggedIn } from "../Middlewares/auth.middleware.js";
import upload from "../Middlewares/multer.middleware.js";

const router = Router();

router.post('/register',upload.single("avatar"), register);
router.get('/me',isLoggedIn, getProfile);
router.post('/login',login);
router.post('/logout', logout);
router.post("/reset", forgotPassword)
router.post("/reset/:resetToken", resetPassword);
router.post("/change-password", isLoggedIn, changePassword);
router.put("/update/:id", isLoggedIn, upload.single("avatar"), updateUser);

export default router;
