var { Activity } = require('../models');
var { generateSearchQuery, generateGetSingleQuery } = require('./utils');

var createActivity = async (data) => {
  try {
    let activities = new Activity(data);
    return await activities.save();
  } catch (error) {
    throw error;
  }
}

var getActivitys = async (cond) => {
  try {
    return await generateSearchQuery(Activity, cond);
  } catch (error) {
    throw error;
  }
};

var getActivity = async (cond, options) => {
  try {
    return await generateGetSingleQuery(Activity, cond, options);
  } catch (error) {
    throw error;
  }
}

var updateActivity = async (cond, data) => {
  try {
    data = Object.assign({}, data, { updatedAt: new Date() });
    switch (typeof cond) {
      case 'string':
        return await Activity.findByIdAndUpdate(cond, data, { new: true });
      default:
        return await Activity.updateMany(cond, data);
    }
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createActivity,
  getActivitys,
  getActivity,
  updateActivity  
};