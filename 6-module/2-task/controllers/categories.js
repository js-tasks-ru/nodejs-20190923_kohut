const Category = require('../models/Category');
const filterBdKeys = require('../libs/helpers/filterBdKeys')
module.exports.categoryList = async function categoryList(ctx, next) {
  const categories = await Category.find();
  const filteredCategories = filterBdKeys(categories, true);
  ctx.body = {categories: [...filteredCategories]};
};
