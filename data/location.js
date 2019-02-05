var { Location } = require('../models');
var { generateSearchQuery, generateGetSingleQuery } = require('./utils');

var createLocation = async (data) => {
  try {
    let location = new Location(data);
    return await location.save();
  } catch (error) {
    throw error;
  }
}

var getLocations = async (cond) => {
  try {
    return await generateSearchQuery(Location, cond);
  } catch (error) {
    throw error;
  }
};

var getLocation = async (cond, options) => {
  try {
    return await generateGetSingleQuery(Location, cond, options);
  } catch (error) {
    throw error;
  }
}

var updateLocation = async (cond, data) => {
  try {
    data = Object.assign({}, data, { updatedAt: new Date() });
    switch (typeof cond) {
      case 'string':
        return await Location.findByIdAndUpdate(cond, data, { new: true });
      default:
        return await Location.updateMany(cond, data);
    }
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createLocation,
  getLocations,
  getLocation,
  updateLocation  
};