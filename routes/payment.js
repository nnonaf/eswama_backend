var Payment = require('../data/payment');
var Bill = require('../data/bill');
// var Cart = require('../data/cart');
var { omit, hasIn, get } = require('lodash');

module.exports = {
  get: async (req, res) => {
    if (req.params.id) {
      try {
        let payment = await Payment.getPayment(req.params.id, req.query);
        res.json(payment);
      } catch (error) {
        res.status(404).json({ message: 'failed to retrieve payment' });
        console.log(error);
      }
    } else {
      try {
        let payments = await Payment.getPayments(req.query);
        console.log(req.query)
        res.json(payments);
      } catch (error) {
        res.status(400).json({ message: 'failed to retrieve payments' });
        console.log(error);
      }
    }
  },
  post: async (req, res) => {
    if (!req.user.isAdmin || (hasIn(req.body, 'verified'))) {
      return res.status(400).json({ message: 'operation not allowed' });
    }
    try {
      let bill = await Bill.getBill(req.body.bill, {
        isCleared: false
      });

      if (bill) {
        //check if payment is exiting on db
        let checkPayment = await Payment.getPayment({
          bill: req.body.bill,
          verified: false
        })

        if (checkPayment) {
          throw { message: 'Your old  transaction is processing.' };
        }

        let payment = await Payment.createPayment(req.body);
        res.json(payment);
      } else {
        throw { message: 'Bill not found' };
      }



    } catch (error) {
      res.status(400).json({ message: 'failed to create payment' });
      console.log(error);
    }
  },
  put: async (req, res) => {
    var update = req.body;
    if (!req.user.isAdmin && (hasIn(req.body, 'verified') || hasIn(req.body, 'processed') || hasIn(req.body, 'processing'))) {
      return res.status(400).json({ message: 'operation not allowed' });
    }
    if (req.user.isAdmin || req.user.id === req.params.id) {
      try {
        let payment = await Payment.getPayment(req.params.id);
        if (payment && (payment.user.id === req.user.id || req.user.isAdmin)) {
          let payment = await Payment.updatePayment(req.params.id, update);
          res.json(payment);
        } else {
          res.status(400).json({ message: 'operation not allowed' });
        }
      } catch (error) {
        res.status(400).json({ message: 'failed to update payment' });
        console.log(error);
      }
    } else {
      res.status(400).json({ message: 'failed to update payment' });

    }
  }
}