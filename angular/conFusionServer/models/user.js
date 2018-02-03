var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var passportLocalMongoose = require('passport-local-mongoose');


//  THIS IS SHOP USER ..

var User = new Schema({
    firstname: {
        type: String,
        default: ''
    },
    facebookId: String,
    lastname: {
        type: String,
        default: ''
    },
    admin: {
        type: Boolean,
        default: false
    },
    phoneNo: {
        type: String,
        default: '',
        required: true
    },
    profilePic: {
        type: String,
        default: ''
    },
    shopkeeper: {
        type: Boolean,
        default: false,
        required: true
    },
    shopInfo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop'
    },
    custInfo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer'
    }
}, {
    timestamps: true
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);