#!/bin/bash

sudo npm install -g nodemon 
if hash gem 2>/dev/null; then
  sudo gem install sass sass-globbing
else
  echo "Could not auto-install sass and sass-globbing, 'gem' was not found."
fi
if hash brew 2>/dev/null; then
  brew install mongodb jsmin
else
  echo "Could not auto-install mongodb and jsmin, 'brew' was not found."
fi
