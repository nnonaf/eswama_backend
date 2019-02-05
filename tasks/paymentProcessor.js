// var Payment = require('../data/payment');
// var Cart = require('../data/cart');
// var Order = require('../data/order');
// var Earning = require('../data/earning');

var { forEach, toString } = require('lodash');

const PAYMENT_PROCESSOR_BATCH_SIZE = process.env.PAYMENT_PROCESSOR_BATCH_SIZE || 500;

var calculateStoreEarning = (amount, fee) => {
  return amount - (fee / 100 * amount);
}

var getPrice = (price, percentageDiscount) => {
  if (percentageDiscount > 0) {
    return price - percentageDiscount / 100 * price;
  }
  return price;
}

module.exports = {
  task: async () => {
    console.log('************ Payment processor task starting **************');
    //get payment(checkout, processing, processed) that has been verified but not processing and not processed( it should be in batches) 
    try {
      let verifiedPyaments = await Payment.getPayments({
        verified: true,
        processing: false,
        processed: false,
        _populate: 'checkout.cart.orders,processor',
        _limit: PAYMENT_PROCESSOR_BATCH_SIZE
      });

      forEach(verifiedPyaments, async (payment) => {        
        let cart = payment.checkout.cart;

        forEach(cart.orders, async (order, key) => {
          // get total cost
          let totalCost = order.quantity * getPrice(order.preferredOption.price, order.preferredOption.percentageDiscount);
          let storeEarning = calculateStoreEarning(totalCost, payment.processor.percentageFee);

          let currentEarning = await Earning.getEarning({ store: order.store });
          if (!currentEarning) {
            await Earning.createEarning(
              {
                store: order.store,
                latestOrders: [order.id],
                available: storeEarning,
                pending: storeEarning,
                total: storeEarning
              }
            )
          } else {
            let update = {
              $inc: {
                available: storeEarning,
                pending: storeEarning,
                total: storeEarning
              },
              $push: {
                latestOrders: order.id
              }
            }
            if (currentEarning.latestOrders.length > 50) {
              update['$pop'] = {
                latestOrders: -1
              };
            }
            await Earning.updateEarning(
              {
                store: order.store,
                latestOrders: { $ne: order.id }
              },
              update
            );
          }

          await Order.updateOrder(order.id, { paid: true });
        });

        //update the payment processed to true
        await Payment.updatePayment(payment.id, { processed: true, processing: false });
      });
    } catch (error) {
      console.log(error);
    }
  }
}