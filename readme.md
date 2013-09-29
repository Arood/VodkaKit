# VodkaKit

VodkaKit is a boilerplate/template/starter kit for [Node.js](http://nodejs.org) focused on the [Express](http://expressjs.com) framework. I made it after I had built a few web projects in Node and found a file structure I liked. So now I can create new projects quick and easy, and start working on my ideas as fast as possible.

<p style="text-align: center"><img src="https://raw.github.com/Arood/VodkaKit/master/assets/images/vodkakit.png" style="height: 400px" /></p>

## Features

* (M)VC-friendly file structure, with distinct division between frontend and backend code.
* During development, all asset-compiling is done automatically when the web server is running.
* Automatic server restart when backend code changes, thanks to [Nodemon](https://github.com/remy/nodemon).
* I'm not calling this a framework, because I expect you to make changes in all files!

## Getting started

1.  Make sure that you have Node.js and NPM installed. Homebrew and Ruby Gems are also recommended.

2.  Since GitHub support SVN, we will exploit this to export VodkaKit without any repository data:

        svn export https://github.com/Arood/VodkaKit/trunk YourProject

3.  `cd` into your project folder and type the following to install required dependencies:

        npm install
    
    Note that it will request your sudo password to install some utilities used by VodkaKit.

4.  Start the server by typing:

        npm start
        
    You can now access your website in your browser with the URL [localhost:1337](http://localhost:1337).
    
## File structure

This is what the initial file structure will look like. Feel free to make changes that fits your needs better.

### assets/

Put your static files like images here. CSS and browser JavaScript will be compiled into `styles.css` and `script.js` in this folder.

### backend/

Node.js-files are saved here. Nodemon will listen for changes in this folder, and restart the web server if a file is edited.

### backend/controllers/

This is where controllers are stored. Each controller defines the routes that will be used by Express. It doesn't matter what you name your files, but it's worth noting that they will be included in an alphabetical order, in case you need to prioritize routes.

Read further below on how to create controllers.

### frontend/

This is where frontend-resources are saved. By default this means SASS-files in the `stylesheets` folder, browser JavaScripts in the `javascript` folder and Jade-templates for your application in the `view` folder.

### scripts/

These are scripts used by VodkaKit when installing or launching the web server.

### package.json

Like any Node.js-application, this is where you add which modules you want NPM to install. This is also where the postinstall- and start-scripts are defined, which might interest you.

### server.js

This is what starts the web server. You'll probably want to add stuff in here that you want to be globally accessed in your application.

## Controllers

Creating controllers is simple. They are really just CommonJS-modules that exports an object with the routes you want to use, grouped by HTTP-verbs. Paths and callbacks works exactly like they do in Express.

Take a look at this example for more details:

    var Controller = function(db) { // db is always sent to the controller for quick database access
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
    }

## ToDo

* A more unified production workflow
* Unit-testing
* Linux- and Windows-commands in postinstall-script