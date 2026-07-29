const passport = require('passport');
const googleStrategy =require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User =require('../models/user');


// tell passport to use new strategy for google login
passport.use(new googleStrategy({
    clientID:"773606793382-jn112inbkok1p1qaajj1cs666rob9ulr.apps.googleusercontent.com",
    clientSecret:"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",
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