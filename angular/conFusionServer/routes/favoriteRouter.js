const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

var authenticate = require('../authenticate');

const Favorites = require('../models/favorite');
const cors = require('./cors');

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
    Favorites.find({})
    .populate('user')
    .populate('dishes')
    .then((favorites) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Favorites.find({"user": req.user._id})
        .then((favorites) => {
            console.log(favorites);
            if(favorites && req.body.length > 0) {
                if(!favorites[0].dishes)
                    favorites[0].dishes = [];    
                
                favorites[0].dishes = favorites[0].dishes.concat(req.body)
                console.log(favorites[0]);
                favorites[0].save()
                .then((dish) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish);                
                }, (err) => next(err));
            } else {
                Favorites.create({"user": req.user._id,"dishes": req.body})
                .then((favorite) => {
                    console.log('Dish Created ', favorite);
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                }, (err) => next(err))
                .catch((err) => next(err));
            }
        }, (err) => next(err))
        .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Favorites.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});

favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
    res.statusCode = 403;
    res.end('GET operation not supported on /:dishId');
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Favorites.find({"user": req.user._id})
        .then((favorites) => {
            console.log(favorites);
            if(favorites[0]) {
                if(favorites[0].dishes)
                    favorites[0].dishes.push(req.params.dishId);
                else
                    favorites[0].dishes = [req.params.dishId];
                favorites[0].save()
                .then((dish) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish);                
                }, (err) => next(err));
            } else {
                Favorites.create({"user": req.user._id._id,"dishes": [req.params.dishId]})
                .then((favorite) => {
                    console.log('Dish Created ', favorite);
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                }, (err) => next(err))
                .catch((err) => next(err));
            }
        }, (err) => next(err))
        .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /:dishId');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Favorites.find({"user": req.user._id})
        .then((favorites) => {
            if(favorites[0] && favorites[0].dishes) {
                if(favorites[0].dishes.indexOf(req.params.dishId) !== -1) {
                    favorites[0].dishes.splice(favorites[0].dishes.indexOf(req.params.dishId), 1);
                    favorites[0].save()
                    .then((dish) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(dish);                
                    }, (err) => next(err));
                }
            }
        }, (err) => next(err))
        .catch((err) => next(err));
});


module.exports = favoriteRouter;