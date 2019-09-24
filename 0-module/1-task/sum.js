const errorMessage = 'One of arguments is not a number';
const requiredType = 'number';

function sum(a, b) {
  const sum = a + b;
  if (typeof sum !== requiredType) {
    throw new TypeError(errorMessage);
  }

  return sum;
}

module.exports = sum;
