var { Mail } = require('../models');
var fs = require('fs');
var path = require("path");
var { template, templateSettings } = require('lodash');

const SITE_URL = process.env.SITE_URL;
const APP_NAME = process.env.APP_NAME;

var sendMail = async (subject, sender, destination, body) => {
  var mail = new Mail({ subject, sender, destination, body });
  return await mail.save();
}

var createMailBody = (type, data) => new Promise((resolve, reject) => {
  fs.readFile(path.resolve(`${__dirname}/mail_templates/${type}.html`), 'utf-8', (err, html) => {
    let compile = template(html);
    resolve(compile(Object.assign({
      _name: APP_NAME,
      _logo: `${SITE_URL}/res/logo.png`
    }, data)));
  });
});

module.exports = {
  sendMail,
  createMailBody
}