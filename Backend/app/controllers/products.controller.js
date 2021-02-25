var Products = require('../models/products.model.js');
const fs = require('fs');

exports.create = async function (req, res) {
    var product = new Products({
        bill: req.body.bill,
        thumbnail: req.body.thumbnail,
        name: req.body.name,
        description: req.body.description,
        customer: req.body.customer,
        requestType: req.body.requestType,
        gold: req.body.gold,
        diamond: req.body.diamond,
        stone: req.body.stone,
        total: req.body.total,
        note: req.body.note,
        status: "Hold",
        manager: req.body.manager,
        customer: req.body.customer,
    });
    product.save(function (err, data) {
        if (err) {
            console.log(JSON.stringify(err));
            res.status(500).send({
                message: "Some error occurred while creating the User."
            });
        } else {
            product.save();
            res.send(product);
        }
    });
};

exports.getNewBill = async function (req, res) {

    Products.count({},
        function (err, data) {
            if (err) {
                res.status(500).send({
                    message: "Could not create new bill no "
                });
            } else {
                res.send((data + 1).toString());
            }
        });
}

exports.list = function (req, res) {
    Products.find(
        {},
        function (err, data) {
            if (err) {
                res.status(500).send({
                    message: "Could not find products " + req.params.status
                });
            } else {
                res.send(data);
            }
        }
    )
}

exports.update = function (req, res) {
    Products.findByIdAndUpdate(req.params.id, req.body, { new: true }, function (err, data) {
        if (err) {
            res.status(500).send({
                message: "Could not update product with id " + req.params.id
            });
        } else {
            Products.find(
                {},
                function (err, data) {
                    if (err) {
                        res.status(500).send({
                            message: "Could not find products " + req.params.status
                        });
                    } else {
                        res.send(data);
                    }
                }
            )
        }
    });
}

exports.delete = function (req, res) {
    Products.deleteOne({ '_id': req.params.id }, function (err, data) {
        if (err) {
            res.status(500).send({
                message: "Could not delete product with id " + req.params.id
            });
        } else {
            Products.find(
                { 'status': 'Hold' },
                function (err, data) {
                    if (err) {
                        res.status(500).send({
                            message: "Could not find products list "
                        });
                    } else {
                        res.send(data);
                    }
                }
            )
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

exports.getHistory = function (req, res) {
    Products.find(
        {"price":{$gte:0}},
        function (err, data) {
            if (err) {
                res.status(500).send({
                    message: "Could not find products in history"
                });
            } else {
                res.send(data);
            }
        }
    )
}