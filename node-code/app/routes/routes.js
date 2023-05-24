module.exports = app => {
    const demo = require("../controllers/controller.js");
  
    var router = require("express").Router();

  
    // Retrieve a single Tutorial with id
    router.get("", demo.findAll);
  
    // Update a Tutorial with id
    router.put("/:id", demo.update);
  
    app.use("/api/coaches", router);
  };