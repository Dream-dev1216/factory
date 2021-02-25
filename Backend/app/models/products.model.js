var mongoose = require('mongoose');

var ProductsSchema = mongoose.Schema({
    bill: {
        type: Number,
        default:0
    },
    thumbnail: {
        type: String,
        default:''
    },
    name: {
        type: String,
        default:'',
        required: true,
    },
    description: {
        type: String,
        default:''
    },
    customer: {
        type: String,
        default:''
    },
    requestType: {
        type: String,
        default:''
    },
    gold: {
        type: Number,
        default:0
    },
    diamond: {
        type: Number,
        default:0
    },
    stone: {
        type: Number,
        default:0
    },
    total: {
        type: Number,
        default:0
    },
    price: {
        type: Number,
        default:-1
    },
    note: {
        type: String,
        default:''
    },
    status: {
        type: String,
        default:''
    },
    manager: {
        type: String,
        default:''
    },
    employer: {
        type: String,
        default:''
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Products', ProductsSchema);