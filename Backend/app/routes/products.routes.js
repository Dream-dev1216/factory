module.exports = function(app) {

    var products = require('../controllers/products.controller.js');
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
    
    var upload = multer({ storage: storage })
    app.post('/products', upload.single('photo'), products.create);
    app.get('/products/newBill', products.getNewBill);
    app.get('/products/', products.list);
    app.patch('/products/:id', upload.single('photo'), products.update);
    app.post('/products/delete/:id', products.delete);
    app.get('/productThumbnail/:url', products.getThumbnail);
    app.get('/history/', products.getHistory);
}