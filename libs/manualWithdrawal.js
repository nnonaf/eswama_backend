const axios = require('axios');
const { map, get } = require('lodash');

var withdraw = async (withdrawal) => {  
  return {
    success: true,
    reference: new Date().getTime(),
    withdrawal
  }
}

module.exports = {
  withdraw
}