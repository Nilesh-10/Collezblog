const passport = require('passport');
const googleStrategy =require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User =require('../models/user');
require('dotenv').config();


// tell passport to use new strategy for google login
passport.use(new googleStrategy({
    clientID:process.env.CLIENT_SEC_ID,
    clientSecret:process.env.CLIENT_SEC_KEY,
    callbackURL:"http://localhost:8000/users/auth/google/callback"
},
    function(accessToken,refreshToken,profile,done){
        // find the user
        User.findOne({email:profile.emails[0].value}).exec(function(err,user){
            if(err){
                console.log("error in google-strategy");
                return;
            }
            console.log(accessToken,refreshToken);
            console.log(profile);
            if(user){
                // if found set user as req.user
                return done(null,user);
            }
            else{
                // if not found create the user and set it as rea.user(means siign in the user)
                User.create({
                    name:profile.displayName,
                    email:profile.emails[0].value,
                    password:crypto.randomBytes(20).toString('hex')
                },
                function(err,user){
                    if(err){
                        console.log("Error in creating user using google-strategy");
                        return;
                    }
                    return done(null,user);
                });
            }
        });
    }

));



module.exports = passport;