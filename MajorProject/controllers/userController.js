const User=require("../models/user");
module.exports.getSignUp=(req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.signUp=async (req,res)=>{
    try{
        let{username,email,password}=req.body;

        const newUser=new User({username,email});
        const registeredUser=await User.register(newUser,password);
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome!! thanku for signup ");
            res.redirect("/listing");
        })
        
    
    }catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
   

}

module.exports.getLogin=(req,res)=>{
    res.render("users/login.ejs");
}

module.exports.Login=async (req,res)=>{

    req.flash("success","Welcome back ");
    res.redirect("/listing");
}

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are logged out")
        res.redirect("/listing");
    })
}