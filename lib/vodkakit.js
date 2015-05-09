var VodkaKit = function(init) {

  var self = this,
      dirname = require('path').dirname(require.main.filename),
      fs = require('fs'),
      sys = require('sys'),
      express = require('express'),
      bodyParser = require('body-parser'),
      cookieParser = require('cookie-parser'),
      util = require('util'),
      colors = require('colors'),
      gulp = require('gulp'),
      jumanji = require('jumanji'),
      app = this.app = express();

  this.db = null;
  this.session = require('express-session');

  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());
  app.use(cookieParser());

  init.call(self, function() {

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
      this.db = require('mongojs').connect(this.mongodb.host, this.mongodb.collections);
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

    // Bundle all CSS and JS assets, on production we also minify them
    var concat = require('gulp-concat'),
        uglify = require('gulp-uglify'),
        autoprefixer = require('gulp-autoprefixer'),
        cssGlobbing = require('gulp-css-globbing'),
        sass = require('gulp-sass');

    if (!this.disableGulp) {

      var cssDir = self.stylesheets || dirname + '/frontend/stylesheets/**/*.sass'
      var jsDir = self.javascripts || dirname + '/frontend/javascripts/**/*.js';

      if (process.env.NODE_ENV === 'production') {
        gulp.src(jsDir)
          .pipe(concat('script.js'))
          .pipe(uglify())
          .pipe(gulp.dest(this.assets || dirname + '/assets'));

        gulp.src(cssDir)
          .pipe(cssGlobbing({ extensions: ['.css', '.scss', '.sass'] }))
          .pipe(sass({ indentedSyntax: true, outputStyle: 'compressed' }))
          .pipe(autoprefixer())
          .pipe(gulp.dest(this.assets || dirname + '/assets'))
      } else {
        gulp.task('styles', function() {
          util.log('[VodkaKit]'.yellow+' Frontend changes: Compiling stylesheets');
          return gulp.src(cssDir)
            .pipe(cssGlobbing({ extensions: ['.css', '.scss', '.sass'] }))
            .pipe(sass({ indentedSyntax: true }))
            .pipe(autoprefixer())
            .pipe(gulp.dest(this.assets || dirname + '/assets'))
        })

        gulp.task('scripts', function() {
          util.log('[VodkaKit]'.cyan+' Frontend changes: Compiling JavaScripts');
          return gulp.src(jsDir)
            .pipe(concat('script.js'))
            .pipe(gulp.dest(this.assets || dirname + '/assets'));
        });

        gulp.watch(jsDir, ['scripts']);
        gulp.watch(cssDir, ['styles']);
      }

    }

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