const express = require("express");
const router=express.Router();
const User=require("../models/user.js")
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");

//==========================signup form render
router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
})
//==========================post request to singup
router.post("/signup",wrapAsync(async (req,res)=>{
    try{
        let{username,email,password}=req.body;

        const newUser=new User({username,email});
        const registeredUser=await User.register(newUser,password);
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome!! thanku for signup ");
            res.redirect("/listing");
        })
        
    
    }catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
   

}));

//================get login form
router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
})

//=================post login request
router.post("/login",passport.authenticate("local",{failureRedirect:"/login",failureFlash:true})
,async (req,res)=>{

    req.flash("success","Welcome back ");
    res.redirect("/listing");
});

//-=-==-=--=-=----=-=-=-=-=-=-=--=-=--=get logout request
router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are logged out")
        res.redirect("/listing");
    })
})

module.exports=router