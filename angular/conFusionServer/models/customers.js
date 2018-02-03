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


var product = new Schema({
    id: String,
    mrp: Number,
    quantity: Number
});

var History = new Schema({
    historyId: mongoose.Schema.Types.ObjectId,
    productList: [product],
    updateInfo: [product],
    updateId: mongoose.Schema.Types.ObjectId
}, {
    timestamps: true
});


/*
        "historyid": "",
        productList: [
            {
                "id": "bb_uid",
                "mrp": ,
                "quantity": 10
            }
        ],
        "date": 5645,
        "updated": 4654,
        "updateInfo": [
            {
                "id": "bb_uid",
                "mrp": ,
                "quantity": 10   
            }
        ]
    }
*/

var monthHis = new Schema({
    month: [History]
});

var location = new Schema({
    type: {
        type: String,
        default: "Point"
    },
    coordinates: [Number]
});



var CustInfo = new Schema({
    location: {
        type: location,
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
    address: {
        type: Address,
        required: true
    },
    history: [monthHis]
}, {
    timestamps: true
});


var Customers = mongoose.model('Customer', CustInfo);

module.exports = Customers;