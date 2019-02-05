var schedule = require('node-schedule');
var { split, forEach, hasIn, invoke, keys } = require('lodash');
var withdrawalProcessor = require('./withdrawalProcessor');
var billingProcessor = require('./billingProcessor');
var paymentVerifier = require('./paymentVerifier');


const TASK_LIST = process.env.TASK_LIST;

const tasks = {
  withdrawalProcessor: [
    { rule: '0 * * * * *', action: withdrawalProcessor.task, invokeImmediate: false }
  ],

  billingProcessor: [
    { rule: '0 * * * * *', action: billingProcessor.task, invokeImmediate: false }
  ],
  paymentVerifier: [
    { rule: '0 * * * * *', action: paymentVerifier.task, invokeImmediate: false }
  ]
}

module.exports = {
  start: () => {
    console.log('Task list =>', TASK_LIST);
    console.log('Available Tasks =>', keys(tasks));
    if (TASK_LIST) {
      let parts = split(TASK_LIST, ',');
      forEach(parts, function (taskName) {
        if (hasIn(tasks, taskName)) {
          forEach(tasks[taskName], function (data) {
            schedule.scheduleJob(data.rule, data.action);
            data.invokeImmediate && data.action();
          });
        }
      });
    }
  }
}