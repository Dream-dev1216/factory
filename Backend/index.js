const app = require('express')();
var bodyParser = require('body-parser');
var http = require('http').createServer(app);
const webSocketServer = require('websocket').server;
const port = process.env.PORT || 3000

var gfs = null;

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
})

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: true
}))

// parse application/json
app.use(bodyParser.json())

var config = JSON.parse(process.env.APP_CONFIG);
var mongoPassword = 'sphinx';
var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect("mongodb://" + config.mongo.user + ":" + encodeURIComponent(mongoPassword) + "@" + config.mongo.hostString, {
//mongoose.connect("mongodb://localhost:27017/Factory", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection.on('error', function () {
  console.log('Could not connect to the database. Exiting now...');
  process.exit();
});
mongoose.connection.once('open', function () {
  // initialize stream
  gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: "uploads"
  });

  console.log("Successfully connected to the database");
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/image/:filename', (req, res) => {
  gfs.find({ filename: req.params.filename }).toArray((err, files) => {
    if (!files[0] || files.length === 0) {
      return res.status(200).json({
        success: false,
        message: 'No files available',
      });
    }

    if (files[0].contentType === 'image/jpeg' || files[0].contentType === 'image/png' || files[0].contentType === 'image/svg+xml') {
      // render image to browser
      gfs.openDownloadStreamByName(req.params.filename).pipe(res);
    } else {
      res.status(404).json({
        err: 'Not an image',
      });
    }
  });
})

require('./app/routes/users.routes.js')(app);
require('./app/routes/products.routes.js')(app);
require('./app/routes/notifications.routes.js')(app);
require('./app/routes/chats.routes.js')(app);
require('./app/routes/common.routes.js')(app);

http.listen(port, () => {
  console.log(`listening on *:${port}`);
});

const wsServer = new webSocketServer({
  httpServer: http
});

let users = {};

wsServer.on('request', function (request) {
  let id = request.requestedProtocols[0];
  const connection = request.accept(null, request.origin);
  console.log('connected ', id, ' In ', connection.remoteAddress);
  users[id] = connection;
  connection.on('message', function (message) {
    if (message.type === 'utf8') {
      // connection.sendUTF(message.utf8Data);
      let messageObject = JSON.parse(message.utf8Data);
      // console.log(messageObject.data.user.name, ' => ', messageObject.receiver, ' : ', messageObject.data.text);
      if (users[messageObject.receiver]) {
        users[messageObject.receiver].sendUTF(message.utf8Data);
      }
      else {
        console.log("user is offline : ", messageObject.receiver);
      }
    } else if (message.type === 'binary') {
      // connection.sendBytes(message.binaryData);
    }
  });
  connection.on('close', function (reasonCode, description) {
    console.log((new Date()) + ' ' + connection.remoteAddress + ' disconnected.');
    delete users[id];
  });
});
