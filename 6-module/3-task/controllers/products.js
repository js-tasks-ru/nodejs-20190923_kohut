const Product = require('../models/Product');
const mapProduct = require('../mappers/mapProduct');

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  const {query} = ctx.query;
  if (!query) ctx.throw(404, 'query is invalid');

  const products = await Product.find({$text: {$search: query}});
  ctx.body = {products: products.map(mapProduct)};
};
