const Listing = require("./models/listing.js");
const Review=require("./models/review.js");
const {listingSchema,reviewSchema}=require("./schemaValidation.js");
const CustomExpressError = require("./utils/CustomExpressError.js");

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){

        req.flash("error","You need to login first");
        return res.redirect("/login")

    }
    next();
}

//Joi ListingSchema Validation fn
module.exports.validateListing=(req,res,next)=>{
    let{error}=listingSchema.validate(req.body);
    if(error){
        throw new CustomExpressError(400,error);
    }else{
        next();
    }
}

//Joi ReviewSchema Validation fn
module.exports.validateReview=(req,res,next)=>{
    let{error}=reviewSchema.validate(req.body);
    if(error){
        throw new CustomExpressError(400,error);
    }else{
        next();
    }
}

module.exports.isOwner= async (req,res,next)=>{
    let{id}=req.params;
    let listing= await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","Your are not the owner of this Property")
        return res.redirect(`/listing/${id}`);
    }
    next();
}

module.exports.isReviewAuthor=async(req,res,next)=>{
let{id,reviewId}=req.params;
let review=await Review.findById(reviewId);
if(!review.author._id.equals(res.locals.currUser._id)){
    req.flash("error","You can't delete this review");
    return res.redirect(`/listing/${id}`);

}
next();
}