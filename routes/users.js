var express = require('express');
const bodyParser= require('body-parser');
var passport= require('passport');
var   User=require('../models/user');
const { route } = require('.');
var authenticate= require('../authenticate');
var router = express.Router();


router.use(bodyParser.json());

/* GET users listing. */
router.post('/signup', (req, res, next) => {

  User.register( new User ({username:req.body.username}), req.body.password, (err,user) =>{
    if(err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err: err});
    }
    else {
      passport.authenticate('local')(req, res, () => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, status: 'Registration Successful!'});
      });
    }
  });
 
});

 




router.post('/login', passport.authenticate('local'), (req, res) => {


  var token = authenticate.getTokens({_id: req.user._id})
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, token: token,  status: 'You are successfully logged in!'});
});




router.get('/logout', (req, res, next)=> {

  if(req.session.user){

    req.session.destroy();//deleting the session's info from the server side
    res.clearCookie('session-id'); //deleting the session's info from the client side
    res.redirect('/');

  }
  else{
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
});

module.exports = router;
