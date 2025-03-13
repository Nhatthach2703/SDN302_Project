const express = require("express");
const router = express.Router();
const passport = require("../config/passport");
const authController = require("../controllers/authController");

// Hiển thị trang login
router.get('/login', authController.showLogin);

router.get('/register', authController.showRegister);

// Đăng ký
router.post("/register", authController.register);

// Đăng nhập local
router.post(
  "/login",
  passport.authenticate("local", { session: false }),
  authController.login
);

// Đăng nhập bằng Facebook
router.get(
  "/facebook",
  passport.authenticate("facebook")
);
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { session: false }),
  authController.facebookCallback
);

// Đăng nhập bằng Google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  authController.googleCallback
);


// Đăng xuất
router.get("/logout", authController.logout);

module.exports = router;
