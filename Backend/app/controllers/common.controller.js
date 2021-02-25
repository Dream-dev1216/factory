var Users = require('../models/users.model.js');
var Products = require("../models/products.model.js");
const _ = require('underscore-node');

exports.getStatements = function (req, res) {
    let resData = {
        managers: 0,
        employers: 0,
        customers: 0,
        process: 0,
        done: 0,
        gold: 0,
        diamond: 0,
        stone: 0,
    }
    Users.countDocuments({ role: 'Manager' }, function (err, c) {
        resData.managers = c;

        Users.countDocuments({ role: 'Employee' }, function (err, c) {
            resData.employers = c;
            Users.countDocuments({ role: 'Customer' }, function (err, c) {
                resData.customers = c;
                Products.countDocuments({ status: 'Process' }, function (err, c) {
                    resData.process = c;
                    Products.countDocuments({ price: { $gte: 0 } }, function (err, c) {
                        resData.done = c;

                        Products.find({ price: { $gte: 0 } }, function (err, results) {
                            if (err) {
                                console.log('find done products error');
                                //handle error
                            }

                            resData.gold = _.reduce(results, function (memo, reading) { return memo + reading.gold; }, 0);
                            resData.diamond = _.reduce(results, function (memo, reading) { return memo + reading.diamond; }, 0);
                            resData.stone = _.reduce(results, function (memo, reading) { return memo + reading.stone; }, 0);
                            res.send(resData);
                        });
                    });
                });
            });
        });
    });
}