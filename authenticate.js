var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user');

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());//determines which data of the user object should be stored in the session
passport.deserializeUser(User.deserializeUser());





