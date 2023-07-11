//! a functiion that catches error
//? removes the repetition of catch and error

module.exports = (func) => {
  return (req, res, next) => {
    func(req, res, next).catch(next);
  };
};
