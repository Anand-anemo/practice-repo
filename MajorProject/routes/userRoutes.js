const express = require("express");
const router=express.Router();
const User=require("../models/user.js")
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const userController=require("../controllers/userController.js");


router.route("/signup")
.get(userController.getSignUp)
.post(wrapAsync(userController.signUp));

//==========================signup form render
//router.get("/signup",userController.getSignUp);
//==========================post request to singup
//router.post("/signup",wrapAsync(userController.signUp));

router.route("/login")
.get(userController.getLogin)
.post(passport.authenticate("local",{failureRedirect:"/login",failureFlash:true})
,userController.Login);


//================get login form
//router.get("/login",userController.getLogin);

//=================post login request
//router.post("/login",
//passport.authenticate("local",{failureRedirect:"/login",failureFlash:true})
//,userController.Login);

//-=-==-=--=-=----=-=-=-=-=-=-=--=-=--=get logout request
router.get("/logout",userController.logout)

module.exports=router