var { Residence } = require('../models');
var { generateSearchQuery, generateGetSingleQuery } = require('./utils');

var createResidence = async (data) => {
  try {
    let residence = new Residence(data);
    return await residence.save();
  } catch (error) {
    throw error;
  }
}

var getResidences = async (cond) => {
  try {
    return await generateSearchQuery(Residence, cond);
  } catch (error) {
    throw error;
  }
};

var getResidence = async (cond, options) => {
  try {
    return await generateGetSingleQuery(Residence, cond, options);
  } catch (error) {
    throw error;
  }
}

var updateResidence = async (cond, data) => {
  try {
    data = Object.assign({}, data, { updatedAt: new Date() });
    switch (typeof cond) {
      case 'string':
        return await Residence.findByIdAndUpdate(cond, data, { new: true });
      default:
        return await Residence.updateMany(cond, data);
    }
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createResidence,
  getResidences,
  getResidence,
  updateResidence  
};