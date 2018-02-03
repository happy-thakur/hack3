const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var subCatSchema = new Schema({
    bb_uid: {
        type: String,
        required: true
    },
    mrp: {
        type: String,
        default: "00.00",
        required: true
    },
    p_img_url: {
        type: String,
        default: "./images/sample.png"
    },
    w: {
        type: String,
        default: ""
    },
    pack_desc: {
        type: String,
        default: ""
    }
});

var mainProdSchema = new Schema({
    tlc_s: {
        type: String
    },
    cat: {
        type: String,
        default: "",
        required: true
    },
    p_brand: {
        type: String
    },
    pc_n: {
        type: String
    },
    tlc_n: {
        type: String
    },
    p_desc: {
        type: String
    },
    all_prods: [subCatSchema]
});

var MainProds = mongoose.model('MainProd', mainProdSchema);

module.exports = MainProds;