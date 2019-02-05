var { Report } = require('../models');
var { generateSearchQuery, generateGetSingleQuery } = require('./utils');

var createReport = async (data) => {
  try {

    //check if report is on db already
    
    let report = new Report(data);
    return await report.save();
  } catch (error) {
    throw error;
  }
}

var getReports = async (cond) => {
  try {
    return await generateSearchQuery(Report, cond);
  } catch (error) {
    throw error;
  }
};

var getReport = async (cond, options) => {
  try {
    return await generateGetSingleQuery(Report, cond, options);
  } catch (error) {
    throw error;
  }
}

var updateReport = async (cond, data) => {
  try {
    data = Object.assign({}, data, { updatedAt: new Date() });
    switch (typeof cond) {
      case 'string':
        return await Report.findByIdAndUpdate(cond, data, { new: true });
      default:
        return await Report.updateMany(cond, data);
    }
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createReport,
  getReports,
  getReport,
  updateReport  
};