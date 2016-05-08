var VodkaKit = function(init) {

  var self = this,
      dirname = require('path').dirname(require.main.filename),
      fs = require('fs'),
      express = require('express'),
      cookieParser = require('cookie-parser'),
      util = require('util'),
      colors = require('colors'),
      jumanji = require('jumanji'),
      bb = require('express-busboy'),
      app = this.app = express();

  this.db = null;
  this.session = require('express-session');

  app.use(cookieParser());

  init.call(self, function() {

    if (this.busboy !== null) {
      bb.extend(app, this.busboy || {
        upload: true
      });
    }

    app.use(jumanji); // Fixes caching bug in Safari
    app.use(express.static(this.assets || dirname + '/assets'));
    app.set('views', this.views || dirname+'/frontend/views');

    // Enables CORS. Useful if you use for example sub domains but want to load assets from your main domain (to prevent unnecessary loading)
    if (!this.disableCORS) {
      app.use(function(res,req,next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        next();
      });
    }

      // VodkaKit comes with MongoJS, if you set this up in your startup options it will be initialized here
    if (this.mongodb) {
      this.db = require('mongojs')(this.mongodb.host, this.mongodb.collections);
    }

    // Initialize the session storage
    if (this.sessions && this.sessions.redis) {
      var RedisStore = require('connect-redis')(this.session);
      app.use(session({
        store: new RedisStore(this.sessions.redis),
        secret: this.sessions.secret,
        resave: true,
        saveUninitialized: true
      }));
    }

    // Here we load all of our controllers and load them into Express
    // The controller is a CommonJS module with a constructor that returns an object with HTTP-verbs, routes and callbacks
    var routeDir = this.routes || dirname + '/backend/routes';
    var controllerFiles = fs.readdirSync(routeDir);
    controllerFiles.forEach(function(file){
      var controller = require(routeDir+'/'+file)(db,app);
      for (var method in controller) {
        for (var route in controller[method]) {
          var r = route;
          if (controller[method][route].length && typeof controller[method][route][0] == "object") {
            r = controller[method][route].shift();
          }
          app[method.toLowerCase()].apply(app, [r].concat(controller[method][route]));
        }
      }
    });

    // Start
    this.http = require('http').createServer(app);
    var port = this.port || process.env.PORT || 1337;
    var listen = function() {
      this.http.listen(port);
    };

    if (process.env.NODE_ENV === 'production') {
      util.log('VodkaKit is now running on port '+port+' in '+'production'.underline.white+' mode');
    } else {
      util.log(('VodkaKit is now running on port '+port+' in development mode').rainbow);
    }

    if (this.preListen) {
      this.preListen(listen);
    } else {
      listen();
    }

  });

  return this;
};

module.exports = VodkaKit;
