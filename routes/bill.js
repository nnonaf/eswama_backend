var Bill = require('../data/bill');
var { omit, hasIn, get } = require('lodash');

module.exports = {
  get: async (req, res) => {
    if (req.params.id) {
      try {
        let bill = await Bill.getBill(req.params.id, req.query);
        res.json(bill);
      } catch (error) {
        res.status(404).json({ message: 'failed to retrieve bill' });
        console.log(error);
      }
    } else {
      try {
        let bill = await Bill.getBills(req.query);
        res.json(bill);
      } catch (error) {
        res.status(400).json({ message: 'failed to retrieve bill' });
        console.log(error);
      }
    }
  },
  post: async (req, res) => {
    if (!req.user.isAdmin) {
      return res.status(400).json({ message: 'operation not allowed' });
    }
    try {
      let bill = await Bill.createBill(req.body);
      res.json(bill);
    } catch (error) {
      res.status(400).json({ message: 'failed to create bill' });
      console.log(error);
    }
  },
  put: async (req, res) => {
    if (!req.user.isAdmin) {
      return res.status(400).json({ message: 'operation not allowed' });
    }
    var update = req.body;
    try {
      let bill = await Bill.getBill(req.params.id);
      if (bill) {
        let bill = await Bill.updateBill(req.params.id, update);
        res.json(bill);
      } else {
        res.status(400).json({ message: 'operation not allowed' });
      }
    } catch (error) {
      res.status(400).json({ message: 'failed to update bill' });
      console.log(error);
    }
  }
}