const express = require("express");
const router=express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");

const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn, isReviewAuthor}=require("../middleware.js");
const ReviewController=require("../controllers/reviewController.js");




//===========================review saved route
router.post("/",isLoggedIn,validateReview,wrapAsync(ReviewController.saveReview));
//======================delete reviews
router.delete("/:reviewId",isLoggedIn,isReviewAuthor ,wrapAsync( ReviewController.deleteReview));


module.exports=router;