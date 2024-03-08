const express = require("express");
const router=express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");

const {isLoggedIn, isOwner,validateListing}=require("../middleware.js");




//==============index route
router.get("/",wrapAsync(async (req,res)=>{
    let  allListing = await Listing.find({});
    res.render("./listing/index.ejs",{allListing})
}));

//===============new Listing
router.get("/new",isLoggedIn,wrapAsync(async (req,res)=>{
    res.render("./listing/new.ejs");
}));
//===============creating listing
router.post("/",isLoggedIn,validateListing, wrapAsync(async (req,res,next)=>{
    
    let newListing= new Listing(req.body.listing);
    newListing.owner=req.user._id;
    await newListing.save();
    req.flash("success","New Listing saved");
    res.redirect("/listing");
}));


//==================edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync( async (req,res)=>{

    let {id}=req.params;
    const listing= await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing requested does not exits!!");
        res.redirect("/listing");
    }
    req.flash("success"," Listing successfully edited");

    res.render("listing/edit.ejs",{listing});


}));
//===============update route
router.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(async (req,res)=>{
   
    let{id}=req.params;
    let listing= await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","Your are not the owner of this Property")
        return res.redirect(`/listing/${id}`);
    }
    await  Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success"," Listing updated");
    res.redirect(`/listing/${id}`);
}));

//====================show route
router.get("/:id",wrapAsync(async (req,res)=>{ 

    let{id}=req.params;
    let listing = await Listing.findById(id).populate({path:"reviews",
    populate: {path:"author"},}).populate("owner");
    if(!listing){
        req.flash("error","Listing requested does not exits!!");
        res.redirect("/listing");
    }
    res.render("./listing/show.ejs",{listing});

}));
//========================delete Route
router.delete("/:id",isLoggedIn,isOwner, wrapAsync(async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing deleted ");
    res.redirect("/listing");
}));

module.exports=router;