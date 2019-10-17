module.exports = function mapProduct({id, title, description, price, category, subcategory, images}) {
  return {
    id,
    title,
    description,
    price,
    category,
    subcategory,
    images,
  };
};
