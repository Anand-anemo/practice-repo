if(process.env.NODE_ENV !="production"){
require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const dburl  = process.env.ATLAS_DB

const CustomExpressError = require("./utils/CustomExpressError.js");
const listingRoutes = require("./routes/listingRoutes.js");
const reviewsRoutes = require("./routes/reviewRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const session = require("express-session");
const MongoStore=require("connect-mongo");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const store=MongoStore.create({
  mongoUrl:dburl,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter:24*3600,
});

store.on("error",()=>{
  console.log("Error in mongoStore ", err);
})
  


const sessionOptions={
  store,
secret:process.env.SECRET,
resave:false,
saveUninitialized:true,
cookie:{
  expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
  maxAge:7*24*60*60*1000,
  httpOnly:true,
}
};



main()
  .then(() => {
    console.log("connection successful");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dburl);
}
//root route
// app.get("/", (req, res) => {
//   res.send("hi  i am root");
// });

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user;
  next();
})

//=================================using lisitngRoutes
app.use("/listing", listingRoutes);
//=================================using reviewsRoutes
app.use("/listing/:id/review", reviewsRoutes);
//=================================using userRoutes
app.use("/",userRoutes);

//======================error handling for page not found
app.all("*", (req, res, next) => {
  next(new CustomExpressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
  let { status = 500, message = "something went wrong" } = err;
  res.status(status).render("./listing/error.ejs", { message });
  // res.status(status).send(message);
});

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});
