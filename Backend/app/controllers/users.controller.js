var User = require('../models/users.model.js');
var Notification = require("../models/notifications.model.js");
const fs = require('fs');

exports.create = async function (req, res) {
    const {
        thumbnail,
        name,
        birth,
        phone,
        address,
        newPassword,
        email,
        role
    } = req.body;
    if (!name || name == '') {
        return res.status(400).send({
            message: "User Name is required"
        });
    }
    if (!newPassword || newPassword == '') {
        return res.status(400).send({
            message: "Password is required"
        });
    }
    var user = new User({
        name: name,
        birth: birth,
        phone: phone,
        address: address,
        password: newPassword,
        email: email,
        role: role,
        thumbnail: thumbnail,
    });
    user.save(function (err, data) {
        if (err) {
            console.log(JSON.stringify(err));
            res.status(500).send({
                message: "Some error occurred while creating the User."
            });
        } else {
            let notifications = new Notification({
                user: data._id,
                notifications: []
            });
            notifications.save();

            user.notifications = notifications;
            user.save();
            res.send(user);
        }
    });
};

exports.findOne = function (req, res) {
    User.findOne({
        "name": req.params.name,
        "password": req.params.password,
        "pending": false
    }, function (err, data) {
        if (err) {
            res.status(500).send({
                message: "Could not retrieve note with id " + req.params.noteId
            });
        } else {
            res.send(data);
        }
    });
};
exports.update = function (req, res) {
    User.findByIdAndUpdate(req.params.id, req.body, { new: true }, function (err, data) {
        if (err) {
            res.status(500).send({
                message: "Could not retrieve note with id " + req.params.id
            });
        } else {
            res.send(data);
        }
    });
}

exports.getThumbnail = function (req, res) {
    fs.readFile(`./uploads/${req.params.url}`, function (err, data) {
        if (err) {
            console.log(err);
            return;
        }
        res.write(data);
        return res.end();
    });
}
exports.getManagers = function (req, res) {
    User.find({ 'role': 'Manager' },
        function (err, data) {
            if (err) {
                res.status(500).send({
                    message: "Could not retrieve note with id " + req.params.noteId
                });
            } else {
                res.send(data);
            }
        });
}
exports.getEmployers = function (req, res) {
    User.find({ 'role': 'Employee' },
        function (err, data) {
            if (err) {
                res.status(500).send({
                    message: "Could not retrieve note with id " + req.params.noteId
                });
            } else {
                res.send(data);
            }
        });
}
exports.getCustomers = function (req, res) {
    User.find({ 'role': 'Customer' },
        function (err, data) {
            if (err) {
                res.status(500).send({
                    message: "Could not retrieve note with id " + req.params.noteId
                });
            } else {
                res.send(data);
            }
        });
}
exports.deleteUser = function (req, res) {
    User.deleteOne({ '_id': req.params.id }, function (err, data) {
        if (err) {
            res.status(500).send({
                message: "Could not retrieve note with id " + req.params.id
            });
        } else {
            res.send(data);
        }
    });
}
exports.pendingUser = function (req, res) {
    User.findByIdAndUpdate(req.params.id, { 'pending': req.params.pending }, { new: true }, function (err, data) {
        if (err) {
            res.status(500).send({
                message: "Could not pending with id " + req.params.id
            });
        } else {
            res.send(data);
        }
    });
}