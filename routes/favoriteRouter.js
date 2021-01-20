const express=require('express');
const bodyParser= require('body-parser');
const mongoose=require('mongoose');
var authenticate = require('../authenticate');
const Favorites= require('../models/favorite') ;
const Dishes= require('../models/dishes') ;
const cors = require('./cors');

const favoriteRouter= express.Router();

favoriteRouter.route('/')

.options(cors.corsWithOptions,  (req, res) => { res.sendStatus(200); })
.get( cors.cors, authenticate.verifyUser, (req, res, next)=>{

    Favorites.find({author: req.user._id})
    .populate('author')
    .populate('dishes')
    .then((favorites) => { 
      res.statusCode=200;
      res.setHeader('Content-Type', 'application/json');
      res.json(favorites);

    }, (err) => next(err))
    .catch((err) => next(err));

}) // [{"_id":"dish ObjectId"}, . . ., {"_id":"dish ObjectId"}]
.post( cors.corsWithOptions, authenticate.verifyUser,  (req, res, next) => {
  Dishes.findOne({ name: req.body.name })
  .then((dish)=>{
          if(dish==null){
            err = new Error('the dish ' + req.body.name + ' is not found');
            err.status = 404;
            return next(err);
          }
          else{

            Favorites.findOne({author: req.user._id})
            .then((favorite)=>{

              if(favorite==null){

                        
            Favorites.create({author: req.user._id})
            .then((favorite)=>{
               
                 
              for(i=0; i<req.body.length ; i++)
              {favorite.dishes.push(req.body[i]._id);
                favorite.save()
                .then((favorite)=>{
                 next();
                }, (err) => next(err))
                .catch((err) => next(err));
              }
              console.log('Favorite dish Created ', favorite);
              res.statusCode=200;
              res.setHeader('Content-Type', 'application/json');
              res.json('one Favorite dish is Created successfuly!! ' + favorite);
              

            
                 
            },(err) => next(err))
            .catch((err) => next(err));

              }

              else{
                for(i=0; i<req.body.length ; i++)
                {favorite.dishes.push(req.body[i]._id);
                  favorite.save()
                  .then((favorite)=>{
                   next();
                  }, (err) => next(err))
                  .catch((err) => next(err));
                }
                console.log('Favorite dish Created ', favorite);
                res.statusCode=200;
                res.setHeader('Content-Type', 'application/json');
                res.json('one Favorite dish is Created successfuly!! ' + favorite);
                

              }

            }, (err) => next(err))
            .catch((err) => next(err));

     
            
          }
  } ,(err) => next(err))
  .catch((err) => next(err));


})
.delete( cors.corsWithOptions, authenticate.verifyUser,(req, res, next) => {
          
      
  Favorites.remove({author: req.user._id })
  .then((resp)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
     res.json('All your favorite dishes are deleted !'); 

   }, (err) => next(err))
  .catch((err) => next(err));
 
});



favoriteRouter.route('/favorites/:dishId')
.get( cors.cors, authenticate.verifyUser, (req, res, next)=>{

  Favorites.find({author: req.user._id})
  .populate('author')
  .populate('dishes')
  .then((favorite) => { 
           
             if(favorite.dishes.id(req.params.dishId)!=null)
             {
              res.statusCode=200;
              res.setHeader('Content-Type', 'application/json');
              res.json(favorites.dishes.id(req.params.dishId));
             }

             else{ 
              res.statusCode=404;
              res.setHeader('Content-Type', 'application/json');
              res.json('The dish'+ req.params.dishId+ 'is not found!');

             }
          
    

  }, (err) => next(err))
  .catch((err) => next(err));

})
.post( cors.corsWithOptions, authenticate.verifyUser,  (req, res, next) => {
  Dishes.findById(req.params.dishId)
  .then((dish)=>{
          if(dish==null){
            err = new Error('the dish ' + req.body.name + ' is not found');
            err.status = 404;
            return next(err);
          }
          else{

            Favorites.findOne({author: req.user._id})
            .then((favorite)=>{

               if(favorite==null)
               {
                                  
            Favorites.create({author: req.user._id})
            .then((favorite)=>{
               Favorites.find(favorite)
               .then((favorite)=>{ 
                favorite.dishes.push(req.params.dishId);
                favorite.save()
                .then((favorite)=>{
                 console.log('Favorite dish Created ', favorite);
                 res.statusCode=200;
                 res.setHeader('Content-Type', 'application/json');
                 res.json('one Favorite dish is Created successfuly!! ' + favorite);
                }, (err) => next(err))
                .catch((err) => next(err));
              }, (err) => next(err))
              .catch((err) => next(err));
            
          }, (err) => next(err))
          .catch((err) => next(err));

        }

        else{
         
               if(favorites.dishes.id(req.params.dishId)!=null){

                err = new Error('the dish ' + req.body.name + ' is already existed in your favorite list');
                    err.status = 403;
                    return next(err);

               }
               else{


                favorite.dishes.push(req.params.dishId);
                favorite.save()
                .then((favorite)=>{
                 console.log('Favorite dish Created ', favorite);
                 res.statusCode=200;
                 res.setHeader('Content-Type', 'application/json');
                 res.json('one Favorite dish is Created successfuly!! ' + favorite);
                }, (err) => next(err))
                .catch((err) => next(err));

               }
          
             
        }
      }, (err) => next(err))
      .catch((err) => next(err));
    }
  }, (err) => next(err))
  .catch((err) => next(err));
})
.delete( cors.corsWithOptions, authenticate.verifyUser,  (req, res, next) => {
Dishes.findById(req.params.dishId)
.then((dish)=>{
         if(dish!=null){

          Favorites.find({author: req.user._id})
          .then((favorite)=>{
              if(favorite!=null){

                if(favorite.dishes.id(req.params.dishId).author==req.user._id && 
                favorite.dishes.id(req.params.dishId)==req.params.dishId)
                {
                  favorite.dishes.id(req.params.dishId).remove();
                  favorite.save()
                  .then((favorite)=>{
                    res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json('The dish' + req.params.dishId+ ' is removed successfuly'); 
              }, (err) => next(err))
              .catch((err) => next(err));
                
                }
                else{

                  err = new Error('The dish' + req.params.dishId+ 
                  ' is not found in your favorite list');
                  err.status = 404;
                    return next(err);

                }

             
            }
              else{
                err = new Error('You have no dish in your favorite list');
                err.status = 404;
                  return next(err);
              }
          })

         }

         else{

          err = new Error('The dish '+ req.params.dishId+ ' is not found!');
          err.status = 404;
            return next(err);

         }
})


});

        
          

                   

module.exports = favoriteRouter;