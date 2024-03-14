const Listing=require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken});

module.exports.index=async (req,res)=>{
    let  allListing = await Listing.find({});
    res.render("./listing/index.ejs",{allListing})
}

module.exports.getNewForm=async (req,res)=>{
    res.render("./listing/new.ejs");
}

module.exports.createListing=async (req,res,next)=>{

   let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
       // query: "Uttarakhand , India",
        limit: 1
      }).send();

    
       
    let url=req.file.path;
    let filename=req.file.filename;
    let newListing= new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    newListing.geolocation=response.body.features[0].geometry
   let savedlisting= await newListing.save();
    console.log(savedlisting);
    req.flash("success","New Listing saved");
    res.redirect("/listing");
}

module.exports.showListing=async (req,res)=>{ 

    let{id}=req.params;
    let listing = await Listing.findById(id).populate({path:"reviews",
    populate: {path:"author"},}).populate("owner");
    if(!listing){
        req.flash("error","Listing requested does not exits!!");
        res.redirect("/listing");
    }
    res.render("./listing/show.ejs",{listing});

}

module.exports.editListing=async (req,res)=>{

    let {id}=req.params;
    const listing= await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing requested does not exits!!");
        res.redirect("/listing");
    }
    req.flash("success"," Listing successfully edited");
    let previousImage=listing.image.url;
    previousImage=previousImage.replace("/upload","/upload/w_250");

    res.render("listing/edit.ejs",{listing,previousImage});


}

module.exports.updateListing=async (req,res)=>{
   
    let{id}=req.params;
    let listing= await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","Your are not the owner of this Property")
        return res.redirect(`/listing/${id}`);
    }
    let updatedListing=await  Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file !== "undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    updatedListing.image={url,filename};
    await updatedListing.save();
}


    req.flash("success"," Listing updated");
    res.redirect(`/listing/${id}`);
}

module.exports.deleteListing=async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing deleted ");
    res.redirect("/listing");
}