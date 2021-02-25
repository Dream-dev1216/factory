module.exports = function(app) {

    var notifications = require('../controllers/notifications.controller.js');

    // {
    //     "receiver": "+9899990",
    //     "sender": "+9889898",
    //     "isNotify": true, //optional
    //     "isSticky": false, //optional
    // }
    app.post('/notifications', notifications.update);
    app.get('/notifications/:userId', notifications.getNotifications);
    app.patch('/notifications/:receiver/:sender', notifications.clearNotification);

}