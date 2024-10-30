const express = require('express');
const userRouter = express.Router();

const { logIn, signUp, getAdminCookie, getUserCookie, logOut, getUserNameById, getUserGender } = require('../controllers/userController');

userRouter
    .post("/logIn", logIn)
    .post("/signUp", signUp)
    .get("/isAdminLoggedIn", getAdminCookie)
    .get("/isUserLoggedIn", getUserCookie)
    .get("/logOut", logOut)
    .post("/getUserNameById", getUserNameById)
    .get("/getUserGender", getUserGender)

module.exports = userRouter;