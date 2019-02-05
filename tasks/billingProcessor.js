
var Residence = require('../data/residence');
var Bill = require('../data/bill');
var { sum } = require('lodash');




const PAYMENT_PROCESSOR_BATCH_SIZE = process.env.PAYMENT_PROCESSOR_BATCH_SIZE || 500;



module.exports = {

  task: async () => {
    console.log('************ Billing processor task starting **************');


    //get all residence with activities amount
    let getResidencyFee = await Residence.getResidences({
      deactivatedComplet: false,
      _populate: 'activitHistory:activities',
      _sort: 'activities.createdAt:-1',
      _limit: PAYMENT_PROCESSOR_BATCH_SIZE
    });

    let totalFee = [];
    var residence_id;

    for (let i = 0; i < getResidencyFee.length; ++i) {
      residence_id = getResidencyFee[i].id
      let getLastActivityArrayId = getResidencyFee[i].activitHistory.length;
      getLastActivityArrayId = getLastActivityArrayId - 1;
      let getLastActivityArray = getResidencyFee[i].activitHistory
      let currentActivities = getLastActivityArray[getLastActivityArrayId].activities;
      for (let i = 0; i < currentActivities.length; ++i) {

        totalFee.push(currentActivities[i].fee)


      }

      //get total fee for the residence
      var total = sum(totalFee)

      var data = {

        residence: residence_id,
        amount: total

      }

      var bill = await Bill.createBill(data)
      console.log(bill); return false




    }

    // getResidencyFee.forEach(element => {
    //   element.activitHistory.forEach(inACtiviteHistory =>{

    //     console.log(inACtiviteHistory)
    //   })
    //   return false;

    // });

    // getResidencyFee.map(function(element){

    //    let activities = element.activitHistory;
    //    console.log(activities); return false;

    //    console.log(activities.length); return false
    //     activities.map(function(value){

    //       console.log(value.CoreMongooseArray);
    //       // const peopleArray = Object.keys(value).map(i =>value[i])
    //       // console.log(peopleArray);



    //     })
    // })

    // console.log(getResidencyFee.activitHistory); return false;





  }
}