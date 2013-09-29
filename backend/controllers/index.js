var Controller = function(db) {

  return {
    "GET": {
      "/": function(req, res) {
        res.render("index.jade");
      }
    }   
  };
};

module.exports = Controller;