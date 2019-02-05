const axios = require('axios');
const { map, get, isBoolean } = require('lodash');
const Log = require('../data/log');

const PAYSTACK_VERIFY_URL = process.env.PAYSTACK_VERIFY_URL;
const PAYSTACK_API_KEY = process.env.PAYSTACK_API_KEY;

var verify = async (deposit) => {
  try {
    let response = await axios({
      method: 'GET',
      url: `${PAYSTACK_VERIFY_URL}/${deposit.reference}`,
      headers: {
        authorization: `Bearer ${PAYSTACK_API_KEY}`
      }
    });
    let data = response.data;
    if (data.status) {
      return {
        success: data.data.status === 'success' ? true : false,
        amount: data.data.amount / 100,
        deposit
      }
    } else {
      return {
        success: false,
        pending: false,
        deposit
      }
    }
  } catch (error) {
    console.log(get(error, 'response.data'));
    let status = get(error, 'response.data.status');
    Log.createLog({
      key: deposit._id,
      type: 'paystak_deposit',
      level: 'error',
      data: get(error, 'response.data')
    });
    return {
      success: false,
      pending: !isBoolean(status),
      deposit
    }
  }
}

module.exports = {
  verify
}