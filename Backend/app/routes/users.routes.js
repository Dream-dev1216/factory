module.exports = function (app) {

  var users = require('../controllers/users.controller.js');
  const GridFsStorage = require('multer-gridfs-storage');
  const crypto = require('crypto');
  const multer = require('multer');
  /* 
  GridFs Configuration
  */

  // create storage engine
  var config = JSON.parse(process.env.APP_CONFIG);
var mongoPassword = 'sphinx';
  const storage = new GridFsStorage({
    url: "mongodb://" + config.mongo.user + ":" + encodeURIComponent(mongoPassword) + "@" + config.mongo.hostString,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          // const filename = buf.toString('hex') + path.extname(file.originalname);
          const fileInfo = {
            filename: file.originalname,
            bucketName: 'uploads'
          };
          resolve(fileInfo);
        });
      });
    }
  });

  var upload = multer({ storage: storage })

  app.post('/users', upload.single('photo'), users.create);
  app.get('/users/:name/:password', users.findOne);
  app.get('/userThumbnail/:url', users.getThumbnail);
  app.patch('/users/:id', upload.single('photo'), users.update);
  app.get('/users/managers', users.getManagers);
  app.get('/users/employers', users.getEmployers);
  app.get('/users/customers', users.getCustomers);
  app.post('/users/delete/:id', users.deleteUser);
  app.patch('/users/pending/:id/:pending', users.pendingUser);
}