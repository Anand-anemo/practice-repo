const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const listingSchema= new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    image:{
       
        type:String,
        default:
            "https://unsplash.com/photos/brown-wooden-house-in-the-woods-sStahKEhT9w",
        set:(v)=> v === "" ? "https://images.unsplash.com/photo-1601918774946-25832a4be0d6?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3Dexi":v
    },

    price:Number,
    location:String,
    country:String

})

const Listing=mongoose.model("Listing",listingSchema);

module.exports=Listing;