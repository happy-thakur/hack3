const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

var authenticate = require('../authenticate');

const Dishes = require('../models/dishes');
const Shops = require('../models/shop');
const MainProds = require('../models/mainProds');
const cors = require('./cors');

// const AutoComplete = require("mongoose-in-memory-autocomplete");

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

// ---------------------------------------


// var configuration = {
//     autoCompleteFields: ["p_desc", "tlc_n", "pc_n", "p_brand"],
//     dataFields: ["_id"],
//     maximumResults: 10,
//     model: MainProds
// }


// //initialization of AutoComplete Module
// var myMembersAutoComplete = new AutoComplete(configuration, function() {
//     //any calls required after the initialization
//     console.log("Loaded " + myMembersAutoComplete.getCacheSize() + " words in auto complete");
// });


// *---------------------------------------




dishRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {
        Shops.find({}, { "all_prods": 1 })
            .populate('generalInfo')
            .then((dishes) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dishes);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Shops.find({ "aadhaarNo": req.user.username, "all_prods": { $elemMatch: { "id": req.body.id } } })
            .then((shop) => {

                console.log(shop);
                if (shop && shop.length > 0) {
                    // already exists..
                    res.status = 400;
                    res.json({ error: true, message: "Product already exist in inventory" });
                    return;
                }

                MainProds.find({ "all_prods": { $elemMatch: { "bb_uid": req.body.id } } })
                    .then((product) => {
                        console.log("----------");
                        console.log(product);
                        if (product && product.length <= 0) {
                            res.status = 400;
                            res.json({ error: true, message: "Product dosn't exist in directory" });
                            return;
                        }
                        Shops.find({ "aadhaarNo": req.user.username })
                            .then((shop2) => {
                                shop2 = shop2[0];
                                console.log(product);
                                req.body["generalInfo"] = product[0]._id;
                                shop2["all_prods"].push(req.body);
                                shop2.save()
                                    .then((product) => {
                                        console.log('Product added ', product);
                                        res.statusCode = 200;
                                        res.setHeader('Content-Type', 'application/json');
                                        res.json(product);
                                    }, (err) => next(err))
                                    .catch((err) => next(err));
                            }, (err) => next(err))
                            .catch((err) => next(err));
                    }, (err) => next(err))
                    .catch((err) => next(err));

            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        if (req.body.dec)
            req.body.value = req.body.value * -1;
        Shops.update({ "aadhaarNo": req.user.username, "all_prods.id": req.body.id }, { $inc: { "all_prods.$.my_mrp": req.body.value } })
            .then((data) => {
                console.log('Product updated ', data);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(data);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('DELETE operation not supported on /dishes/');
    });

dishRouter.route('/:no')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {
        console.log("this i");
        var temp = new RegExp(req.query.que, "i")
        var tempArr = [];
        req.params.no = parseInt(req.params.no);
        // by cat
        if (req.query.cat) {
            tempArr.push({ "cat": temp });
            tempArr.push({ "pc_n": temp });
            tempArr.push({ "tlc_n": temp });
            tempArr.push({ "tlc_s": temp });
        }

        if (req.query.brand) {
            tempArr.push({ "p_brand": temp });
        }

        if (req.query.p_name)
            tempArr.push({ "p_desc": temp });

        console.log(tempArr);

        MainProds.find({ $or: tempArr }).limit(req.params.no)
            .then((data) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(data);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /dishes/' + req.params.dishId);
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Dishes.findByIdAndUpdate(req.params.dishId, {
                $set: req.body
            }, { new: true })
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Dishes.findByIdAndRemove(req.params.dishId)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

function filterShop(shops, req) {
    return new Promise((resolve, reject) => {
        resolve(shops.filter((data) => {
            var lat = req.query.lat;
            var long = req.query.long;
            var dis = req.query.dis;
            var tempObj = {};
            tempObj = data;

            var lat2 = data.lat;
            var long2 = data.long;
            var distance = (((Math.acos(Math.sin((lat * Math.PI / 180)) *
                Math.sin((lat2 * Math.PI / 180)) + Math.cos((lat * Math.PI / 180)) *
                Math.cos((lat2 * Math.PI / 180)) * Math.cos(((long - long2) * Math.PI / 180)))) * 180 / Math.PI) * 60 * 1.1515 * 1.609344);
            // if (distance <= dis) { shopDetails.push(data); return data; } else { return false; }
            tempObj["distance"] = distance;

            console.log("this is in");

            if (distance <= dis) {
                // console.log(data);
                // acc.push(data);
                // data["distance"] = distance;
                // shopDetails.push({ "dis": distance });
                shopDetails.push({ shop: tempObj, distance });
                return true;
            } else {

                return false;
            }
        }))
    });
}

var shopDetails = [];

dishRouter.route('/shops/shops/shops')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {
        shopDetails = [];
        // console.log("3333333");

        Shops.find({ "all_prods": { $elemMatch: { "id": req.query.id } } }).then((data) => {
            return filterShop(data, req);
        }).then((data2) => {
            // console.log("data");
            // console.log("--" + data);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(shopDetails);
        }).catch(err => next(err));

    });


dishRouter.route('/shops/shops/getList')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {
        shopDetails = [];
        // console.log("3333333");

        Shops.find({ "all_prods": { $elemMatch: { "id": req.query.id } } }).then((data) => {
            return filterShop(data, req);
        }).then((data2) => {
            // console.log("data");
            // console.log("--" + data);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(shopDetails);
        }).catch(err => next(err));

    });

dishRouter.route('/:dishId/comments')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {
        Dishes.findById(req.params.dishId)
            .populate('comments.author')
            .then((dish) => {
                if (dish != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish.comments);
                } else {
                    err = new Error('Dish ' + req.params.dishId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                if (dish != null) {
                    req.body.author = req.user._id;
                    dish.comments.push(req.body);
                    dish.save()
                        .then((dish) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(dish);
                        }, (err) => next(err));
                } else {
                    err = new Error('Dish ' + req.params.dishId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /dishes/' +
            req.params.dishId + '/comments');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                if (dish != null) {
                    for (var i = (dish.comments.length - 1); i >= 0; i--) {
                        dish.comments.id(dish.comments[i]._id).remove();
                    }
                    dish.save()
                        .then((dish) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(dish);
                        }, (err) => next(err));
                } else {
                    err = new Error('Dish ' + req.params.dishId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    });

dishRouter.route('/:dishId/comments/:commentId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {
        Dishes.findById(req.params.dishId)
            .populate('comments.author')
            .then((dish) => {
                if (dish != null && dish.comments.id(req.params.commentId) != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish.comments.id(req.params.commentId));
                } else if (dish == null) {
                    err = new Error('Dish ' + req.params.dishId + ' not found');
                    err.status = 404;
                    return next(err);
                } else {
                    err = new Error('Comment ' + req.params.commentId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /dishes/' + req.params.dishId +
            '/comments/' + req.params.commentId);
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                if (!req.user._id.equals(dish.comments.id(req.params.commentId).author)) {
                    const err = new Error("You are not authorized to perform this operation!");
                    err.status = 403;
                    return next(err);
                }
                if (dish != null && dish.comments.id(req.params.commentId) != null) {
                    if (req.body.rating) {
                        dish.comments.id(req.params.commentId).rating = req.body.rating;
                    }
                    if (req.body.comment) {
                        dish.comments.id(req.params.commentId).comment = req.body.comment;
                    }
                    dish.save()
                        .then((dish) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(dish);
                        }, (err) => next(err));
                } else if (dish == null) {
                    err = new Error('Dish ' + req.params.dishId + ' not found');
                    err.status = 404;
                    return next(err);
                } else {
                    err = new Error('Comment ' + req.params.commentId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                if (!req.user._id.equals(dish.comments.id(req.params.commentId).author)) {
                    const err = new Error("You are not authorized to perform this operation!");
                    err.status = 403;
                    return next(err);
                }
                if (dish != null && dish.comments.id(req.params.commentId) != null) {
                    dish.comments.id(req.params.commentId).remove();
                    dish.save()
                        .then((dish) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(dish);
                        }, (err) => next(err));
                } else if (dish == null) {
                    err = new Error('Dish ' + req.params.dishId + ' not found');
                    err.status = 404;
                    return next(err);
                } else {
                    err = new Error('Comment ' + req.params.commentId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    });


module.exports = dishRouter;