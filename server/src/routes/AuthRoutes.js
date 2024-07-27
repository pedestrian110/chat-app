const {Router} = require("express");
const {verifyToken} = require("../middlewares/AuthMiddleware.js");
const {signup, login, updateProfile, addProfileImage, removeProfileImage, getUserInfo, logout} = require("../controllers/AuthController.js");
const multer = require("multer");



const authRoutes = Router();
const upload = multer({ dest: "uploads/profiles/" });
authRoutes.post("/signup", signup);
authRoutes.post("/login", login);
authRoutes.get('/user-info', verifyToken, getUserInfo);
authRoutes.post("/update-profile", verifyToken, updateProfile);
authRoutes.post("/add-profile-image", verifyToken, upload.single("profile-image"), addProfileImage);
authRoutes.delete("/remove-profile-image", verifyToken, removeProfileImage);
authRoutes.post("/logout", logout);

module.exports = authRoutes;