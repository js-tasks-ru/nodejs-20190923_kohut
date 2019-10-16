module.exports = function transformIdAndRemoveKeys(data) {
  if (typeof data === 'object' && !('_id' in data)) return data;

  const {_id, ...elementWithoutId} = data;
  delete elementWithoutId['__v']; // remove unnecessary key
  return {
    ...elementWithoutId,
    id: _id,
  };
};
