const express = require("express");
const { requireLogin } = require("../middleware/Authenticate");
const router = express.Router();

const {
    signup,
    login,
    forgotPassword,
    resetPassword,
    activateAccount,
    userId,
    reSendLink,
    update,
} = require("../controllers/auth.controller");

router.post("/users/signup", signup);

router.post("/users/login", login);

router.post("/users/update", requireLogin, update);

router.post("/forgot-password", forgotPassword);

router.post("/new-password", resetPassword);

router.get("/users/userId", requireLogin, userId);

router.post("/emailverify", activateAccount);

router.post("/re-send-link", reSendLink);

module.exports = router;
