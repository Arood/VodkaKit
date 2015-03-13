#!/usr/bin/env node
var app = require('commander'),
    fs = require('fs'),
    util = require('util'),
    colors = require('colors'),
    inquirer = require('inquirer'),
    path = require('path'),
    dirname = process.cwd();

var packagejson = {};

var createVodkaKit = function() {
  if (!packagejson.scripts) { packagejson.scripts = {} };
  packagejson.scripts.start = "NODE_ENV=development ./node_modules/nodemon/bin/nodemon.js --ignore assets --ignore frontend index.js";
  packagejson.scripts.production = "NODE_ENV=production ./node_modules/nodemon/bin/nodemon.js --ignore assets --ignore frontend index.js";

  if (!packagejson.dependencies) { packagejson.dependencies = {} };
  packagejson.dependencies.vodkakit = "^3.0.0";
  packagejson.dependencies.nodemon = "^1.3.7";

  fs.mkdirSync(dirname+"/assets");
  fs.mkdirSync(dirname+"/backend");
  fs.mkdirSync(dirname+"/backend/routes");
  fs.mkdirSync(dirname+"/frontend");
  fs.mkdirSync(dirname+"/frontend/javascripts");
  fs.mkdirSync(dirname+"/frontend/stylesheets");
  fs.mkdirSync(dirname+"/frontend/views");

  fs.writeFileSync(dirname+"/index.js", fs.readFileSync(__dirname+"/templates/index.vodka"));
  fs.writeFileSync(dirname+"/backend/routes/index.js", fs.readFileSync(__dirname+"/templates/route.vodka"));
  fs.writeFileSync(dirname+"/frontend/views/index.jade", fs.readFileSync(__dirname+"/templates/view.vodka"));
  fs.writeFileSync(dirname+"/frontend/views/layout.jade", fs.readFileSync(__dirname+"/templates/layout.vodka"));

  fs.writeFileSync(dirname+"/frontend/javascripts/script.js", "");
  fs.writeFileSync(dirname+"/frontend/stylesheets/style.sass", "");

  fs.writeFileSync(dirname+"/package.json", JSON.stringify(packagejson, null, 2));

  console.log("\nDone!".white.bold+" The last step is to install required dependencies by running "+"npm install".underline+". \nThen start your server by running "+"npm start".underline+".");

};

app
  .version(require('../package.json').version)
  .description('VodkaKit provides a simple boilerplate web framework for NodeJS, based on Express and several other modules.');
  
app
  .command('init')
  .description('creates a new project in the current directory')
  .action(function(env, options) {

    if (fs.existsSync(dirname + "/package.json")) {
      console.log("\nVodkaKit".white.bold+" will create a directory structure in this project, and add new settings\nto your package.json file.\n");

      inquirer.prompt([
        {
          type: "confirm",
          name: "orly",
          message: "continue?",
        }
      ], function( answers ) {
        if (answers.orly) {
          packagejson = JSON.parse(fs.readFileSync(dirname + "/package.json"));
          createVodkaKit();
        }
      });
    } else {
      console.log("\nVodkaKit".white.bold+" will create a new web application in this directory. Note that this\ndirectory doesn't have a package.json file so it will be created too.\n");

      inquirer.prompt([
        {
          type: "confirm",
          name: "orly",
          message: "continue?",
        }
      ], function( answers ) {
        if (answers.orly) {
          inquirer.prompt([
            {
              type: "input",
              name: "name",
              default: path.basename(dirname),
              message: "name",
            },
            {
              type: "input",
              name: "version",
              default: "1.0.0",
              message: "version",
            },
            {
              type: "input",
              name: "description",
              message: "description",
            },
            {
              type: "input",
              name: "author",
              message: "author"
            },
            {
              type: "input",
              name: "license",
              message: "license"
            }
          ], function( answers ) {
            packagejson = answers;
            createVodkaKit();
          });
        }
      });
    }
  
  });

app.parse(process.argv);

if (!process.argv.slice(2).length) app.help();