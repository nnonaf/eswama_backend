var Activity = require('../data/activity');
var { omit, hasIn, get } = require('lodash');

module.exports = {
  get: async (req, res) => {
    if (req.params.id) {
      try {
        let activity = await Activity.getActivity(req.params.id, req.query);
        res.json(activity);
      } catch (error) {
        res.status(404).json({ message: 'failed to retrieve activity' });
        console.log(error);
      }
    } else {
      try {
        let activity = await Activity.getActivitys(req.query);
        res.json(activity);
      } catch (error) {
        res.status(400).json({ message: 'failed to retrieve activity' });
        console.log(error);
      }
    }
  },
  post: async (req, res) => {
    try {


      if (!req.user.isAdmin ) {
        return res.status(400).json({ message: 'operation not allowed' });
      }

      let activity = await Activity.createActivity(req.body);
      res.json(activity);
    } catch (error) {
      res.status(400).json({ message: 'failed to create activity' });
      console.log(error);
    }
  },
  put: async (req, res) => {

    var update = req.body;
    if (!req.user.isAdmin ) {
      return res.status(400).json({ message: 'operation not allowed' });
    }
    try {
      let activity = await Activity.getActivity(req.params.id);
      if (activity) {
        console.log(update)
        let activity = await Activity.updateActivity(req.params.id, update);
        res.json(activity);
      } else {
        res.status(400).json({ message: 'operation not allowed' });
      }
    } catch (error) {
      res.status(400).json({ message: 'failed to update activity' });
      console.log(error);
    }
  }
}