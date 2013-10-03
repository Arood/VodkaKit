// Here we load the Node-modules we want to use. We also decide which MongoDB-collections we want.
var db = require("mongojs").connect(process.env.MONGOLAB_URI || 'mongodb://localhost/database', [
      'collection'
    ]),
    express = require("express"),
    app = express(),
    fs = require('fs'),
    server = require("http").createServer(app),
    store = new express.session.MemoryStore;

// Configuration for all environments
app.configure(function () {
  app.use(express.cookieParser());
  app.use(express.session({ secret: "My secret", store: store }));
  app.use(function(req, res, next) {
    // Put methods and variables that you know will be used on **all** pages here
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    app.locals({
      title: "VodkaKit"
    });
    next();
  });
  app.use(express.static(__dirname + '/assets'));
  app.set("views", __dirname+"/frontend/views");
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
});

// Configuration for Development environment
app.configure('development', function(){

});

// Configuration for Production environment
app.configure('production', function(){

});

// Here we load all controllers from backend/controllers/ and load the routes into Express
// The controller is a CommonJS module with a constructor that returns an object with HTTP-verbs, routes and callbacks
var controller_files = fs.readdirSync(__dirname + '/backend/controllers');
controller_files.forEach(function(file){
  var controller = require(__dirname + '/backend/controllers/'+file)(db);
  for (var method in controller) {
    for (var route in controller[method]) {
      app[method.toLowerCase()].apply(app, [route].concat(controller[method][route]));
    }
  }
});

// This part launches the watch-script for SASS and JavaScript
if (process.argv.indexOf("--watch-frontend")) {
  var spawn = require('child_process').spawn,
      script = spawn('sh', ['scripts/watch.sh']);
  script.stdout.on('data', function (data) {
    process.stdout.write(data);
  });
  process.once('SIGUSR2', function () {
    script.kill();
    process.kill(process.pid, 'SIGUSR2');
  });
}

var port = process.env.PORT || 1337;
server.listen(port);