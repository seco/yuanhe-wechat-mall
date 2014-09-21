/**
 * store action handler
 *
 * @author Bobby Tang
 */
exports.index = function(req, res, next) {
  var mock = {
    total_count: 1,
    items: [{
      id: 1,
      alias: 'nicheng',
      storeName: 'mingcheng',
      storeAddress: 'dizhi'
    }, {
      id: 2,
      alias: 'nicheng2',
      storeName: 'mingcheng2',
      storeAddress: 'dizhi2'
    }]
  };
  res.json(mock);
};
exports.show = function(req, res, next) {
  res.json({
    id: 10,
    storeName: 'this is a storeName',
    storeType: 'VirtualStore'
  });
};
exports.edit = function(req, res, next) {

};
exports.new = function(req, res, next) {

};
exports.create = function(req, res, next) {

};
exports.update = function(req, res, next) {

};
exports.destroy = function(req, res, next) {

};
