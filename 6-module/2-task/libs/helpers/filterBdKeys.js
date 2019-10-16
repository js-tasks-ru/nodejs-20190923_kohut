const transformIdAndRemoveKeys = require('./transformIdAndRemoveKays')

function filterBdKeys(data, recursive) {
  let filteredArray;
  filteredArray = data.map((element) => {
    return element.toJSON
      ? transformIdAndRemoveKeys(element.toJSON())
      : transformIdAndRemoveKeys(element);
  });

  if (recursive) {
    filteredArray = filteredArray.map((element) => {
      // eslint-disable-next-line guard-for-in
      for (const key in element) {
        element[key] = Array.isArray(element[key]) ? filterBdKeys(element[key]) : element[key];
      }
      return element;
    });
  }

  return filteredArray;
}

module.exports = filterBdKeys;
