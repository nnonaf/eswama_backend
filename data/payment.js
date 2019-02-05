var { Payment} = require('../models');
var bcrypt = require('bcrypt-nodejs');
var { keys, omit, get } = require('lodash');
var { generateSearchQuery, generateGetSingleQuery } = require('./utils');

var createPayment = async (data) => {
  try {
    let payment = new Payment(data);
    return await payment.save();
  } catch (error) {
    throw error;
  }
}

var getPayments = async (cond) => {
  try {
    return await generateSearchQuery(Payment, cond);
  } catch (error) {
    throw error;
  }
};

var getPayment = async (cond, options) => {
  try {
    return await generateGetSingleQuery(Payment, cond, options);
  } catch (error) {
    throw error;
  }
}

var updatePayment = async (cond, data) => {
  try {
    data = Object.assign({}, data, { updatedAt: new Date() });
    switch (typeof cond) {
      case 'string':
        return await Payment.findByIdAndUpdate(cond, data, { new: true });
      default:
        return await Payment.updateMany(cond, data);
    }
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createPayment,
  getPayments,
  getPayment,
  updatePayment
};