var Notification = require('../models/notifications.model.js');
var User = require('../models/users.model.js');

exports.update = async function (req, res) {
    if (!req.body) {
        return res.status(400).send({
            message: "Note can not be empty..."
        });
    }
    const {
        sender,
        receiver,
    } = req.body;
    if (!sender || sender == "" || !receiver || receiver == "") {
        return res.status(400).send({
            message: "Content can't be blank"
        });
    }
    let senderuser = await User.findOne({
        _id: sender
    });
    let receiveruser = await User.findOne({
        _id: receiver
    })
        .populate('notifications')
        .exec();
    if (!receiveruser || !senderuser) {
        return res.status(500).send({
            message: "User not found"
        });
    }

    if (!receiveruser.notifications) {
        let notifications = new Notification({
            user: receiveruser._id,
            notifications: []
        });
        receiveruser.notifications = notifications;
        receiveruser.save();
    }

    let index = receiveruser.notifications.notifications.findIndex((notification) => (
        JSON.stringify(notification.senduser) == JSON.stringify(senderuser._id)
    ));
    if (index == -1) {
        receiveruser.notifications.notifications.push({
            senduser: senderuser._id,
            count: 1,
        });
    } else {
        receiveruser.notifications.notifications[index].count++;
    }
    receiveruser.notifications.save();
    res.send("Notificaion updated");
};

exports.getNotifications = async function (req, res) {
    User.find({},
        async function (err, users) {
            if (err) {
                res.status(500).send({
                    message: "Could not find users"
                });
            } else {
                let userNotifications = await User.findOne({
                    _id: req.params.userId
                })
                    .populate('notifications')
                    .exec();
                var resData = [];
                users.filter(function (user) {
                    return user._id != req.params.userId && user.role != 'Customer';
                }).map(user => {
                    let index = userNotifications.notifications.notifications.findIndex((notification) => (
                        JSON.stringify(notification.senduser) == JSON.stringify(user._id)
                    ));
                    let count = 0;
                    if (index >= 0) {
                        count = userNotifications.notifications.notifications[index].count;
                    }
                    resData.push({
                        id: user._id,
                        thumbnail: user.thumbnail,
                        name: user.name,
                        count: count
                    })
                })
                res.send(resData);
            }
        }
    )
}
exports.clearNotification = async function (req, res) {
    Notification.findOne({
        user: req.params.receiver
    },
        function (err, currentNotifications) {
            if (err) {
                res.status(500).send({
                    message: "Could not find you " + req.params.reciever
                });
            } else {
                let index = currentNotifications.notifications.findIndex((notification) => (
                    JSON.stringify(notification.senduser) == JSON.stringify(req.params.sender)
                ));
                currentNotifications.notifications[index].count = 0;
                currentNotifications.save();
                res.send(currentNotifications);
            }
        }
    )
}