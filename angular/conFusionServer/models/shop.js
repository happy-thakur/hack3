var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Address = new Schema({
    shop_no: {
        type: String,
        default: "",
        required: true
    },
    locality: {
        type: String,
        default: ""
    },
    city: {
        type: String,
        required: true
    },
    pincode: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    }
})


var prodSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    my_mrp: {
        type: Number,
        default: -1
    },
    quantity: {
        type: Number,
        default: 0
    },
    offer: {
        type: String,
        default: ""
    },
    generalInfo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MainProd'
    }
});

var ShopInfo = new Schema();
ShopInfo.add({
    location: {
        "type": {
            type: String,
            default: "Point"
        },
        "coordinates": [{
                type: Number,
                default: '',
                required: true
            },
            {
                type: Number,
                default: '',
                required: true
            }
        ]
    },
    shopName: {
        type: String,
        default: '',
        required: true
    },
    aadhaarNo: {
        type: String,
        default: '',
        unique: true,
        required: true,
        validate: {
            validator: (v) => {
                return v.length == 12;
            },
            message: "{VALUE} is not valid Aadhaar No."
        }
    },
    tinNo: {
        type: String,
        default: '',
        required: true,
        unique: true
    },
    shop_pics: [String],
    address: {
        type: Address,
        required: true
    },
    all_prods: [prodSchema]
});


var Shops = mongoose.model('Shop', ShopInfo);

module.exports = Shops;