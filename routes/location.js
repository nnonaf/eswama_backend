var Location = require('../data/location');
var { omit, hasIn, get } = require('lodash');

module.exports = {
  get: async (req, res) => {
    if (req.params.id) {
      try {
        let location = await Location.getLocation(req.params.id, req.query);
        res.json(location);
      } catch (error) {
        res.status(404).json({ message: 'failed to retrieve location' });
        console.log(error);
      }
    } else {
      try {

        console.log(req.user.id)
        let location = await Location.getLocations(req.query);
        res.json(location);
      } catch (error) {
        res.status(400).json({ message: 'failed to retrieve location' });
        console.log(error);
      }
    }
  },
  post: async (req, res) => {
    if (!req.user.isAdmin) {
      return res.status(400).json({ message: 'operation not allowed' });
    }
    try {
      let location = await Location.createLocation(req.body);
      res.json(location);
    } catch (error) {
      res.status(400).json({ message: 'failed to create location' });
      console.log(error);
    }
  },
  put: async (req, res) => {

    if (!req.user.isAdmin) {
      return res.status(400).json({ message: 'operation not allowed' });
    }
    var update = req.body;
    try {
      let location = await Location.getLocation(req.params.id);
      if (location) {
        let location = await Location.updateLocation(req.params.id, update);
        res.json(location);
      } else {
        res.status(400).json({ message: 'operation not allowed' });
      }
    } catch (error) {
      res.status(400).json({ message: 'failed to update location' });
      console.log(error);
    }
  }
}