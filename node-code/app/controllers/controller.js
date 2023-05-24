const db = require("../models");
const Coach = db.coaches;

// Find a single coach with an id
  exports.findAll = (req, res) => {
    Coach.find()
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({ message: "Error retrieving coaches" });
      });
  };

// Update a coach by the id in the request
exports.update = (req, res) => {
  console.log(req);
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;
  console.log(req.body);
  Coach.findByIdAndUpdate(id, req.body)
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update coach with id=${id}. Maybe coach was not found!`
        });
      } else res.send({ message: "coach was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating coach with id=" + id
      });
    });
};