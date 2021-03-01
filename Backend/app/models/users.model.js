var mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    birth: {
        type: String,
        required: false,
        unique: false,
    },
    phone: {
        type: String,
        required: false,
        unique: false,
    },
    address: {
        type: String,
        required: false,
        unique: false,
    },
    password: {
        type: String,
        required: true,
        unique: false,
    },
    email: {
        type: String,
        required: false,
        unique: false,
    },
    tax: {
        type: Number,
        default:0
    },
    role: {
        type: String,
        default:"Employee"
    },
    thumbnail: {
        type: String,
    },
    pending: {
        type: Boolean,
        default: false
    },
    notifications: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Notification'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', UserSchema);