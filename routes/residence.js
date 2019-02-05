var Residence = require('../data/residence');
var { omit, hasIn, get } = require('lodash');

module.exports = {
  get: async (req, res) => {
    if (req.params.id) {
      try {
        let residence = await Residence.getResidence(req.params.id, req.query);
        res.json(residence);
      } catch (error) {
        res.status(404).json({ message: 'failed to retrieve residence' });
        console.log(error);
      }
    } else {
      try {
        let residence = await Residence.getResidences(req.query);
        res.json(residence);
      } catch (error) {
        res.status(400).json({ message: 'failed to retrieve residence' });
        console.log(error);
      }
    }
  },
  post: async (req, res) => {
    let residence
    if (hasIn(req.body, ' verified') || hasIn(req.body, 'verifiedBy') || hasIn(req.body, ' deactivated') ||
      hasIn(req.body, 'deactivatedComplet')) {
      return res.status(400).json({ message: 'operation not allowed' });
    }
    try {
      //checking for residence information 

      let checkResidence = await Residence.getResidence({
        user: req.body.user,
        location: req.body.location,

      });
      if (!checkResidence) {
        residence = await Residence.createResidence(req.body);
      } else {

        //check if user have blocked this residence
        let checkDeactivated = await Residence.getResidence({
          user: req.body.user,
          location: req.body.location,
          deactivated: false
        });

        //  console.log(checkDeactivated); return false
        if (!checkDeactivated) { residence = [] }
        else {
          //updating the user activity

          residence = await Residence.updateResidence(checkDeactivated.id, {
            $push: {
              activitHistory: req.body.activitHistory
            }
          })
        }

      }

      // console.log(checkResidence); return false

      res.json(residence);
    } catch (error) {
      res.status(400).json({ message: 'failed to create residence' });
      console.log(error);
    }
  },
  put: async (req, res) => {
    var update = req.body;

    try {


      // console.log(req.params.id); return false;
      
      let residence = await Residence.getResidence(req.params.id);
      if (residence) {


        if (req.user.isAdmin) {
          //give admin all access

          //check for verification data, this is to make sure that d admin who did the verification is also collected
          if (hasIn(update, 'verified')) {
            var verifiedBy = req.user.id
            update.verifiedBy = verifiedBy

          }

          let residence = await Residence.updateResidence(req.params.id, update);
          res.json(residence);
        } else {

          //prevent the user from effecting a change which his not authorized to do 
          if (hasIn(update, 'verified') || hasIn(update, 'verifiedBy') ||
            hasIn(update, 'deactivatedComplet')) {
            return res.status(400).json({ message: 'operation not allowed' });
          }


          let residence = await Residence.updateResidence(req.params.id, update);
          res.json(residence);
        }

      } else {
        res.status(400).json({ message: 'operation not allowed' });
      }
    } catch (error) {
      res.status(400).json({ message: 'failed to update residence' });
      console.log(error);
    }
  }
}