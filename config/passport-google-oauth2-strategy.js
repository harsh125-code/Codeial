const passport=require('passport');
const googleStrategy=require('passport-google-oauth').OAuth2Strategy;
const crypto=require('crypto');
const User=require('../models/users');

passport.use(new googleStrategy({
    clientID:"1058656455912-vss5oj4iibg0oq7oqedv3ijl7ricjder.apps.googleusercontent.com",
    clientSecret:"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",
    callbackURL:"http://localhost:8000/users/auth/google/callback"
},
function(accessToken,refreshToken,profile,done){
    User.findOne({email:profile.emails[0].value}).exec(function(err,user){
        if(err)
        {
            console.log('error in google auth strategy',err); 
            return;
        }
        console.log(profile);
        if(user)
        {
            return done(null,user);
        }else
        {
            User.create({
                name:profile.displayName,
                email:profile.emails[0].value,
                password:crypto.randomBytes(20).toString('hex')
            },function(err,user){
                if(err)
                {
                    console.log('error in creating user google strategy-passport',err);return ;
                }
                return done(null,user);
            })
        }
    })
}))
module.exports=passport;