module.exports = function (app) {

    var common = require('../controllers/common.controller.js');
    app.get('/statements', common.getStatements);

}