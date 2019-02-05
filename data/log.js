var { Log } = require('../models');
var { generateSearchQuery, generateGetSingleQuery } = require('./utils');

var createLog = async (data) => {
  try {
    let log = new Log(data);
    return await log.save();
  } catch (error) {
    throw error;
  }
}

var getLogs = async (cond) => {
  try {
    return await generateSearchQuery(Log, cond);
  } catch (error) {
    throw error;
  }
};

var getLog = async (cond, options) => {
  try {
    return await generateGetSingleQuery(Log, cond, options);
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getLog,
  getLogs,
  createLog
}