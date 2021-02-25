var mongoose = require('mongoose');

var NotificationSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    notifications: [{
        senduser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        count: {
            type: Number,
            default: 0
        }
    }],
}, {
    timestamps: true
});

module.exports = mongoose.model('Notification', NotificationSchema);