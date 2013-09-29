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

// development only
app.configure('development', function(){

});

// production only
app.configure('production', function(){

});

var controller_files = fs.readdirSync(__dirname + '/backend/controllers');
controller_files.forEach(function(file){
  var controller = require(__dirname + '/backend/controllers/'+file)(db);
  for (var method in controller) {
    for (var route in controller[method]) {
      app[method.toLowerCase()].apply(app, [route].concat(controller[method][route]));
    }
  }
});

if (process.argv.indexOf("--watch-frontend")) {
  var spawn = require('child_process').spawn,
      script = spawn('sh', ['scripts/watch.sh']);
  script.stdout.on('data', function (data) {
    process.stdout.write(data);
  });
}

var port = process.env.PORT || 1337;
server.listen(port);