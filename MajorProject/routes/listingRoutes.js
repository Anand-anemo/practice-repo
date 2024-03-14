const express = require("express");
const router=express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const listingController=require("../controllers/listingController.js");

const {isLoggedIn, isOwner,validateListing}=require("../middleware.js");
const multer=require("multer");
const{storage}=require("../cloudConfig.js");
const upload=multer({storage});

router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,upload.single("listing[image]") ,validateListing,wrapAsync(listingController.createListing));

//==============index route
//router.get("/",wrapAsync(listingController.index));

//===============new Listing
router.get("/new",isLoggedIn,wrapAsync(listingController.getNewForm));
//===============creating listing
//router.post("/",isLoggedIn,validateListing, wrapAsync(listingController.createListing));

router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner, wrapAsync(listingController.deleteListing));



//==================edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync( listingController.editListing));
//===============update route
//router.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(listingController.updateListing));

//====================show route
//router.get("/:id",wrapAsync(listingController.showListing));
//========================delete Route
//router.delete("/:id",isLoggedIn,isOwner, wrapAsync(listingController.deleteListing));

module.exports=router;