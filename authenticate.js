var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user');
var JwtStrategy= require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

var config=require('./config');

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());//determines which data of the user object should be stored in the session
passport.deserializeUser(User.deserializeUser());


exports.getTokens= function(user){
  return jwt.sign(user, config.secretKey, {expiresIn: 3600})
};

var opts={};
opts.jwtFromRequest= ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey=config.secretKey;
exports.jwtPassport=passport.use(new JwtStrategy(opts,  
  (jwt_payload, done) => {
    console.log("JWT payload: ", jwt_payload);
    User.findOne({_id: jwt_payload._id}, (err, user) => {
        if (err) {
            return done(err, false);
        }
        else if (user) {
            return done(null, user);
        }
        else {
            return done(null, false);
        }
    });
}));

exports.verifyUser=passport.authenticate('jwt', {session: false});

exports.verifyAdmin= (req, res, next)=>{
          
 
            if(req.user.admin==true){
              next();
            }
            else{
              var err = new Error('Only the admin can execute such a request!');
              err.status = 403;
              next(err);
            }
          }



