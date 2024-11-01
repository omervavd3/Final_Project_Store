const express = require('express');
const userRouter = express.Router();

const { logIn, signUp, getAdminCookie, getUserCookie, logOut, getUserNameById, getUserGender, changePassword, deleteUser, getUserName } = require('../controllers/userController');

userRouter
    .post("/logIn", logIn)
    .post("/signUp", signUp)
    .get("/isAdminLoggedIn", getAdminCookie)
    .get("/isUserLoggedIn", getUserCookie)
    .get("/logOut", logOut)
    .post("/getUserNameById", getUserNameById)
    .get("/getUserGender", getUserGender)
    .patch("/changePassword", changePassword)
    .delete("/deleteUser", deleteUser)
    .get("/getUserName", getUserName)

module.exports = userRouter;