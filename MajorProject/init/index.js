const mongoose=require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js")

main().then(()=>{
    console.log("connection successful");
}).catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wonderlust")
}

let initDb=async ()=>{
    await Listing.deleteMany({});
    initdata.data=initdata.data.map((obj)=>({...obj,owner:'65e82a6d3bfc124882a805a4'}));

    await Listing.insertMany(initdata.data);
    console.log("data initialise in db");
}

initDb();
