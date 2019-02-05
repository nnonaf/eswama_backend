
var payment = require("../data/payment")
var bill = require("../data/bill");
var paystack = require("./../libs/paystack")
var { forEach } = require('lodash');

const VERIFY_PAYMENTS_LIMIT = process.env.VERIFY_PAYMENTS_LIMIT || 500;

module.exports = {
    task: async () => {
        console.log('************ payment verifier task starting **************');

        //getting all the payment in the system that are not yet verified
        let payments = await payment.getPayments({ verified: 'false', _limit: VERIFY_PAYMENTS_LIMIT });

        if (payment != []) {

            forEach(payments, async (pmt) => {

                //checking the reference with paystack
                let verificationResult = await paystack.verify(pmt);
                if (verificationResult.success) {
                    //updating the amount paid on db
                    payment.updatePayment(
                        {
                            _id: pmt._id
                        },
                        {
                            amountPaid: verificationResult.amount,
                            verified: true,
                            fault: pmt.amount !== verificationResult.amount ? true : false,
                            amountPaid: verificationResult.amount
                        }
                    );


                    //updating bill
                    bill.updateBill({

                        id: pmt.bill
                    }, {
                            isCleared: pmt.amount !== verificationResult.amount ? true : false,


                        })


                } else {
                    //if not success communicate fault to database
                    payment.updatePayment(
                        {
                            _id: pmt._id
                        },
                        {
                            verified: verificationResult.pending ? false : true,
                            fault: verificationResult.pending ? false : true,
                        }
                    );
                }
            })

        }

        // console.log(payments); return false;

    }
}