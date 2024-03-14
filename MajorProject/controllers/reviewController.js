const Listing=require("../models/listing");
const Review=require("../models/review");



module.exports.saveReview=async (req,res)=>{
    let listing= await Listing.findById(req.params.id);
    //console.log(listing);
    let newreview=new Review(req.body.review);
    newreview.author=req.user._id;
    //console.log(newreview);

    listing.reviews.push(newreview);

    await newreview.save();
    await listing.save();

    req.flash("success","New Review saved");

    res.redirect(`/listing/${listing._id}`)

}

module.exports.deleteReview=async(req,res)=>{
    let{id,reviewId}=req.params;
   await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
   await Review.findByIdAndDelete(reviewId);
   req.flash("success","Review deleted");

   res.redirect(`/listing/${id}`);

}