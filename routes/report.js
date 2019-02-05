var Report = require('../data/report');
var { omit, hasIn, get } = require('lodash');

module.exports = {
  get: async (req, res) => {
    if (req.params.id) {
      try {
        let report = await Report.getReport(req.params.id, req.query);
        res.json(report);
      } catch (error) {
        res.status(404).json({ message: 'failed to retrieve report' });
        console.log(error);
      }
    } else {
      try {
        let report = await Report.getReports(req.query);
        res.json(report);
      } catch (error) {
        res.status(400).json({ message: 'failed to retrieve report' });
        console.log(error);
      }
    }
  },
  post: async (req, res) => {
    let report
    try {

      if (!req.user.isAdmin || (hasIn(req.body, 'status'))) {
        return res.status(400).json({ message: 'operation not allowed' });
      }
      //  console.log(req.body.location); return false;
      //check if report in on d db 
      let checkReport = await Report.getReport({
        location: req.body.location,
        status: false,
      });
      if (!checkReport) {
        //create new report
        report = await Report.createReport(req.body);
        // res.json(report);
      } else {
        //add report to an already exiting report
        report = await Report.updateReport(checkReport.id, {
          $push: {
            from: req.body.from
          }
        }


        )


      }
      res.json(report);

      // console.log(checkReport); return false;

    } catch (error) {
      res.status(400).json({ message: 'failed to create report' });
      console.log(error);
    }
  },
  put: async (req, res) => {
    if (!req.user.isAdmin) {
      return res.status(400).json({ message: 'operation not allowed' });
    }
    var update = req.body;
    try {
      let report = await Report.getReport(req.params.id);
      if (report) {
        let report = await Report.updateReport(req.params.id, update);
        res.json(report);
      } else {
        res.status(400).json({ message: 'operation not allowed' });
      }
    } catch (error) {
      res.status(400).json({ message: 'failed to update report' });
      console.log(error);
    }
  }
}