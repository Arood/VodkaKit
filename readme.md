# VodkaKit

VodkaKit is a boilerplate/template/starter kit for [Node.js](http://nodejs.org), powered by popular frameworks like [Express](http://expressjs.com). I made it after I had built a few web projects and found a file structure I liked. In the latest iteration, it also allows your to create new projects quickly with a command line tool.

<p style="text-align: center"><img src="https://raw.github.com/Arood/VodkaKit/master/vodkakit.png" height="400" style="height: 400px" /></p>

## Features

* (M)VC-friendly file structure, with distinct division between frontend and backend code.
* Frontend JavaScripts and CSS are automatically compiled and minified using [Gulp](http://gulpjs.com).
* Automatic server restart when backend code changes, thanks to [Nodemon](https://github.com/remy/nodemon).
* Common settings are done automatically (like MongoDB and Redis sessions), but can be disabled if you want to add your own modifications.
* Includes a CLI-tool to quickly create new projects.

## Getting started

Make sure that you have Node.js and NPM installed. MongoDB and Redis is also recommended. Then follow one of the instructions below:

### The easy way

1.  Install VodkaKit globally (you might have to add `sudo` depending on your setup):

        npm install -g vodkakit

2.  `cd` into your project folder and type the following to get started:

        vodkakit init

3.  Install required dependencies:

        npm install

4.  Start the web server:

        npm start

    You can now access your website in your browser with the URL [localhost:1337](http://localhost:1337).

### Advanced usage

If you prefer setting up VodkaKit manually, you can simply install it by running:

    npm install --save vodkakit

Then in your startup script, add the following code:

    require('vodkakit')(function(start) {
      start();
    });

You will add your own configurations inside the function, before `start()` is called. VodkaKit expects a certain folder structure to work, read on below to find out the default values or how you can change them if you want to.

## File structure

Read this section to find out more about the file structure VodkaKit works with, and how you can override some of these paths if you wish.

Note: If you change a path, you might want to change the start script in package.json so Nodemon restarts properly when you edit your code.

### Assets

Put your static files like images here. CSS and browser JavaScript will be compiled into `styles.css` and `script.js` in this folder.

Default path: `assets/`
Override with: `this.assets` (string)

### Routes

This is where your controllers will be stored. Each controller defines the routes that will be used by Express. It doesn't matter what you name your files, but it's worth noting that they will be included in an alphabetical order, in case you need to prioritize routes.

Read further below on how to work with controllers.

Default path: `backend/routes/`
Override with: `this.routes` (string)

### Views

This is where your HTML-templates are stored. By default VodkaKit is shipped with [Jade](http://jade-lang.com), but it should work with any format supported by Express.

Default path: `frontend/views/`
Override with: `this.views` (string)

### JavaScripts

Frontend JavaScripts are stored here, and will be concatenated to the assets-directory when the server is running. In production mode it will also be minified. The path is handled by Gulp and therefore supports globbing too.

Default path: `frontend/javascripts/**/*.js`
Override with: `this.javascripts` (string)

### Stylesheets

By default VodkaKit works with Sass, which will be compiled into the assets-directory. In production mode it will also be minified. The path is handled by Gulp and therefore supports globbing too.

Default path: `frontend/stylesheets/**/*.sass`
Override with: `this.stylesheets` (string)

## Controllers

Creating a controller is simple. They are just a CommonJS-module with a function that returns an object that contains the routes that Express will be using.

The function will be executed in the same context as the web server, so you can access Express, your database or any other property set by VodkaKit or yourself via `this`. You can also use several callbacks in an array if you want to.

Take a look at this example for more details:

    module.exports = function() {
        var db = this.db;
        return {
            "GET": {
                "/": function(req,res) {
                    res.render("index.jade");
                },
                "/cats": [
                    // You can also use an array of callbacks if you want
                    function(req,res,next) {
                        if (user) {
                            next();
                        } else {
                            res.render("error.jade");
                        }
                    },
                    function(req,res) {
                        res.render("cats.jade");
                    }
                ]
            }
        };
    };

If you want to use regular expressions on your route, pass an array like in the cats-example above but add your expression as the first object in the array.

## Reference

Availability refers to when the property or method is actually useful. `this` is shared between configuration and controllers, but some properties may not exist until after configuration, and some might still exist in your controller but changing them won't affect your application.

### this.app

This property contains ExpressJS.

Availability: configuration, preListen, controllers

### this.assets

`(string)` Path to static assets. When undefined it defaults to `assets/`

Availability: configuration

### this.db

If you choose to setup MongoDB via VodkaKit, this property will contain the MongoJS-instance.

Availability: preListen, controllers

### this.http

The [HTTP](https://nodejs.org/api/http.html#http_http_createserver_requestlistener)-server.

Availability: preListen

### this.javascripts

`(string)` Path to frontend JavaScripts. When undefined it defaults to `frontend/javascripts/`

Availability: configuration

### this.preListen(callback)

`(function)` A method that runs after configuration is complete, but right before the HTTP-server starts listening to your port. You can for example use this to add a [socket.io](http://socket.io) to your server.

* `callback` - If you create a preListen-method, make sure to use the callback-function to start the server.

Availability: configuration

### this.routes

`(string)` Path to backend controllers. When undefined it defaults to `backend/routes/`

Availability: configuration

### this.sessions

An [express-session](https://github.com/expressjs/session) object that you can use if you want to use another session store than Redis.

Availability: configuration

### start()

Callback used to start the web server after configuration is complete.

Availability: configuration

### this.stylesheets

`(string)` Path to frontend stylesheets. When undefined it defaults to `frontend/stylesheets/`

Availability: configuration