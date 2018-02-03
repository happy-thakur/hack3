var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
var User = require('../models/user');
var Shop = require('../models/shop');
var Customer = require('../models/customers');
var passport = require('passport');
var authenticate = require('../authenticate');

const cors = require('./cors');

router.use(bodyParser.json());
/* GET users listing. */
router.get('/', cors.cors, authenticate.verifyUser, function(req, res, next) {
    User.find({})
        .populate("shopInfo")
        .then((users) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(users);
        }, (err) => next(err))
        .catch((err) => next(err));
});


//  this is to create shop...
function createShop(user, req, res, next) {
    Shop.create(req.body.shopInfo)
        .then((shop) => {
            console.log('Shop Created ', shop);

            if (shop._id)
                user.shopInfo = shop._id;
            else {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.json({ error: true, "message": "Unable to create shop" });
                return;
            }

            user.save((err, user) => {
                if (err) {
                    res.statusCode = 500;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({ err: err });
                    return;
                }
                // LOGING IN..
                passport.authenticate('local')(req, res, () => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({ success: true, status: 'Registration Successful!' });
                });
            });

        }, (err) => next(err))
        .catch((err) => next(err));
}

//  this is to create customer..
function createCustomer(user, req, res, next) {
    Customer.create(req.body.custInfo)
        .then((customer) => {
            console.log("Cutomer created", cutomer);
            if (customer._id) {
                user.custInfo = customer._id;
            } else {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.json({ error: true, "message": "Unable to create customer" });
                return;
            }

            user.save((err, user) => {
                if (err) {
                    res.statusCode = 500;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({ err: err });
                    return;
                }
                // LOGING IN..
                passport.authenticate('local')(req, res, () => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({ success: true, status: 'Registration Successful!' });
                });
            });
        }, (err) => next(err))
        .catch((err) => next(err));
}

router.post('/signup', cors.corsWithOptions, (req, res, next) => {

    if (!req.body.shopkeeper && !req.body.customer) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({ err: err, errorMess: "Create either Customer Id or Shop id" });
        return;
    }

    User.register(new User({
            username: req.body.username,
            phoneNo: req.body.phoneNo
        }),
        req.body.password, (err, user) => {
            if (err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.json({ err: err });
                return;
            } else {

                console.log("inside");
                //  check for all fields and fill..

                //  BASIC INFO
                if (req.body.firstname)
                    user.firstname = req.body.firstname;
                if (req.body.lastname)
                    user.lastname = req.body.lastname;
                if (req.body.profilePic)
                    user.profilePic = req.body.profilePic;


                if (req.body.shopkeeper && req.body.shopInfo) {

                    // CREATING SHOP.
                    // createShop(user, req, res, next);
                    Shop.create(req.body.shopInfo)
                        .then((shop) => {
                            console.log('Shop Created ', shop);

                            if (shop._id)
                                user.shopInfo = shop._id;
                            else {
                                res.statusCode = 500;
                                res.setHeader('Content-Type', 'application/json');
                                res.json({ error: true, "message": "Unable to create shop" });
                                return;
                            }

                            user.save((err, user) => {
                                if (err) {
                                    res.statusCode = 500;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json({ err: err });
                                    return;
                                }
                                // LOGING IN..
                                passport.authenticate('local')(req, res, () => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json({ success: true, status: 'Registration Successful!' });
                                });
                            });

                        }, (err) => next(err))
                        .catch((err) => next(err));

                } else if (req.body.customer && req.body.custInfo) {

                    // CREATING CUSTOMER..
                    // createCustomer(user, req, res, next);
                    Customer.create(req.body.custInfo)
                        .then((customer) => {
                            console.log("Cutomer created", cutomer);
                            if (customer._id) {
                                user.custInfo = customer._id;
                            } else {
                                res.statusCode = 500;
                                res.setHeader('Content-Type', 'application/json');
                                res.json({ error: true, "message": "Unable to create customer" });
                                return;
                            }

                            user.save((err, user) => {
                                if (err) {
                                    res.statusCode = 500;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json({ err: err });
                                    return;
                                }
                                // LOGING IN..
                                passport.authenticate('local')(req, res, () => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json({ success: true, status: 'Registration Successful!' });
                                });
                            });
                        }, (err) => next(err))
                        .catch((err) => next(err));

                } else {
                    user.save((err, user) => {
                        if (err) {
                            res.statusCode = 500;
                            res.setHeader('Content-Type', 'application/json');
                            res.json({ err: err });
                            return;
                        }
                        // LOGING IN..
                        passport.authenticate('local')(req, res, () => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json({ success: true, status: 'Registration Successful!' });
                        });

                    });
                }
            }
        });
});

router.put('/', cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {

    User.find({ "username": req.user.username })
        .then((user) => {
            if (!user) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.json({ error: true, "message": "User not found.." });
            }
            // request may contain to add shop or to become customer..
            if (req.body.customer && req.body.custInfo) {
                // means create a cutomer..
                createCustomer(req, res, next);

            } else if (req.body.shopkeeper && req.body.shopInfo) {
                // means create a shop..
                createShop(req, res, next);

            } else {
                // error..
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.json({ error: true, errMess: "error" });
                return;
            }
        }, (err) => next(err))
        .catch((err) => next(err));
})


router.post('/login', cors.corsWithOptions, passport.authenticate('local'), (req, res) => {

    var token = authenticate.getToken({ _id: req.user._id });
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({ success: true, token: token, status: 'You are successfully logged in!' });
});

router.get('/logout', cors.cors, (req, res) => {
    if (req.session) {
        req.session.destroy();
        res.clearCookie('session-id');
        res.redirect('/');
    } else {
        var err = new Error('You are not logged in!');
        err.status = 403;
        next(err);
    }
});


router.get('/facebook/token', passport.authenticate('facebook-token'), (req, res) => {
    if (req.user) {
        var token = authenticate.getToken({ _id: req.user._id });
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({ success: true, token: token, status: 'You are successfully logged in!' });
    }
});

module.exports = router;