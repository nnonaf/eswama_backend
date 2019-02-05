var { Bill } = require('../models');
var { generateSearchQuery, generateGetSingleQuery } = require('./utils');

var createBill = async (data) => {
  try {
    let bill = new Bill(data);
    return await bill.save();
  } catch (error) {
    throw error;
  }
}

var getBills = async (cond) => {
  try {
    return await generateSearchQuery(Bill, cond);
  } catch (error) {
    throw error;
  }
};

var getBill = async (cond, options) => {
  try {
    return await generateGetSingleQuery(Bill, cond, options);
  } catch (error) {
    throw error;
  }
}

var updateBill = async (cond, data) => {
  try {
    data = Object.assign({}, data, { updatedAt: new Date() });
    switch (typeof cond) {
      case 'string':
        return await Bill.findByIdAndUpdate(cond, data, { new: true });
      default:
        return await Bill.updateMany(cond, data);
    }
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createBill,
  getBills,
  getBill,
  updateBill  
};