const isOwnProperty = (object, property) => {
  return Object.prototype.hasOwnProperty.call(object, property);
};

module.exports = isOwnProperty;
