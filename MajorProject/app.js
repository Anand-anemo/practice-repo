const express=require("express");
const app =express();
const mongoose = require("mongoose");
//const listing=require("./models/listing.js");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const customExpressError= require("./utils/CustomExpressError.js");
const CustomExpressError = require("./utils/CustomExpressError.js");
const {listingSchema}=require("./schemaValidation.js")

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


main().then(()=>{
    console.log("connection successful");
}).catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wonderlust")
}
//root route
app.get("/",(req,res)=>{
    res.send("hi  i am root")
})
const validateListing=(req,res,next)=>{
    let{error}=listingSchema.validate(req.body);
    if(error){
        throw new CustomExpressError(400,error);
    }else{
        next();
    }
}
//==============index route
app.get("/listing",wrapAsync(async (req,res)=>{
    let  allListing = await Listing.find({});
    res.render("./listing/index.ejs",{allListing})
}));

//===============new Listing
app.get("/listing/new",wrapAsync(async (req,res)=>{
    res.render("./listing/new.ejs");
}));
//===============creating route
app.post("/listing",validateListing, wrapAsync(async (req,res,next)=>{
    
    let newListing= new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listing");
}));
//==================edit route
app.get("/listing/:id/edit",wrapAsync( async (req,res)=>{

    let {id}=req.params;
    const listing= await Listing.findById(id);

    res.render("listing/edit.ejs",{listing});


}));
//===============update route
app.put("/listing/:id",validateListing,wrapAsync(async (req,res)=>{
   
    let{id}=req.params;
    await  Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listing/${id}`);
}));

//====================show route
app.get("/listing/:id",wrapAsync(async (req,res)=>{

    let{id}=req.params;
    let listing = await Listing.findById(id);
    res.render("./listing/show.ejs",{listing});

}));

app.delete("/listing/:id", wrapAsync(async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listing");
}));

app.all("*",(req,res,next)=>{

    next(new CustomExpressError(404,"Page not found"));

});

app.use((err,req,res,next)=>{
    let{status=500,message="something went wrong"}=err;
    res.status(status).render("./listing/error.ejs",{message});
    // res.status(status).send(message);
});


app.listen(8080,()=>{
    console.log("server is listening to port 8080");
})