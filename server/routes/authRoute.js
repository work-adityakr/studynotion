const express = require("express");
const passport = require("passport");
const { auth } = require("../middleware/auth.js"); 
const jwt = require("jsonwebtoken");

const router =express.Router();

// step-1 Redirect to google login
router.get("/google", (req, res, next) => {
    const { type } = req.query; 
    passport.authenticate("google", { 
        scope: ["profile", "email"],
        state: type // This sends the role to Google to be returned later
    })(req, res, next);
});

router.get("/google/callback",
    passport.authenticate("google",{session:false}),
    (req,res)=>{
        try {
            const user = req.user; 
            const token=jwt.sign({ email: user.email, id: user._id, role: user.role },
        process.env.JWT_SECRET,
        {
          expiresIn: "24h",
        });

      // Set cookie for token and return success response
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
         secure: true, // Required for cross-site cookies in 2025
         sameSite: 'none'
      }
      res.cookie("token", token, options);

        res.redirect(`${process.env.CLIENT_URL}/auth-success?token=${token}`)
        } catch (error) {
            console.error("Google login error",error)
            res.redirect(`${process.env.CLIENT_URL}/login?error=google_failed`)
        }
    }
)

router.get("/me",auth,(req,res)=>{
    console.log("gggggggggggg",req.user);
    
    res.json({success:true,user:req.user})
})

module.exports = router