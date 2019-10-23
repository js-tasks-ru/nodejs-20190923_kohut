const Order = require('../models/Order');
const Product = require('../models/Product');
const sendMail = require('../libs/sendMail');

module.exports.checkout = async function checkout(ctx, next) {
  const {product, phone, address} = ctx.request.body;

  const order = await Order.create({
    user: ctx.user,
    product,
    phone,
    address,
  });

  const {id} = order;
  const productInfo = await Product.findById(product);

  sendMail({
    template: 'order-confirmation',
    to: ctx.user.email,
    subject: 'Подтверждение заказа',
    locals: {
      id,
      product: productInfo,
    },
  });

  ctx.body = {order: id};
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
  const orders = await Order.find({user: ctx.user.id}).populate('product');
  return ctx.body = {orders};
};
