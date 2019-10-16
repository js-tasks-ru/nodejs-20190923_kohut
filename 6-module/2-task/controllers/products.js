const mongoose = require('mongoose')
const Product = require('../models/Product');
const filterBdKeys = require('../libs/helpers/filterBdKeys');
const transformIdAndRemoveKeys = require('../libs/helpers/transformIdAndRemoveKays');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const {subcategory} = ctx.query;

  if (!subcategory) next();

  if (!mongoose.Types.ObjectId.isValid(subcategory)) {
    ctx.throw(400, 'invalid subcategory id');
  }
  const products = await Product.find({subcategory});
  const filteredProducts = filterBdKeys(products);
  ctx.body = {products: [...filteredProducts]};
};

module.exports.productList = async function productList(ctx, next) {
  const products = await Product.find();
  const filteredProducts = filterBdKeys(products);
  ctx.body = {products: [...filteredProducts]};
};

module.exports.productById = async function productById(ctx, next) {
  const {id} = ctx.params;
  if (!mongoose.Types.ObjectId.isValid(id)) ctx.throw(400, 'invalid product id');

  const product = await Product.findById(id);
  if (!product) ctx.throw(404, 'product doesn\'t exist');

  const clearProduct = transformIdAndRemoveKeys(product.toJSON());
  ctx.body = {product: clearProduct};
};

