/**
 * routes
 *
 * @author Bobby Tang, Minix Li
 */

// Load the route handlers
var routes = require('./handlers');

var gateway = require('./handlers/weixin/message/gateway');
var oauth = require('./handlers/weixin/oauth');
var qrcode = require('./handlers/qrcode');
var adminProduct = require('./handlers/admin/product');

var store = require('./handlers/store');
var order = require('./handlers/order');
var settlement = require('./handlers/settlement');
var product = require('./handlers/product');
var sign = require('./handlers/sign');

module.exports = function(app) {

  // auth(order sensitive)
  app.get('/login', sign.login);
  app.post('/signin', sign.signin);
  app.get('/signout', sign.signout);

  // message from weixin mall public number
  app.get('/weixin/message/mall', gateway.access);
  app.post('/weixin/message/mall', gateway.receive);
  // message from store weixin public number
  app.get('/weixin/message/store', gateway.access);
  app.post('/weixin/message/store', gateway.receive);

  // product promotion page
  app.get('/product/promotion/:store_openid/:product_openid', product.promotion);

  // QR code
  app.get('/qrcode/scene_id/:scene_id', qrcode.showWithSceneId);
  app.get('/qrcode/url/:url', qrcode.showWithUrl);

  // product
  // app.get('/products/:store_id/:product_id', product.show);
  app.post('/admin/products/refresh', adminProduct.refresh);

  app.get('/linked_items', function(req, res, next){
    res.render('linked_items');
  });
  app.get('/view_items', function(req, res, next){
    res.render('view_items');
  });
  /**
   * enable auth
   */
  app.all('*', sign.checkAuth);
  // manager
  app.get('/', routes.index);

  /*
   *GET     /forums              ->  index
   *GET     /forums/new          ->  new
   *POST    /forums              ->  create
   *GET     /forums/:id          ->  show
   *GET     /forums/:id/edit     ->  edit
   *PUT     /forums/:id          ->  update
   *DELETE  /forums/:id          ->  destroy
   */

  // stores api
  app.get('/stores', store.index); // Backbone.Collection.fetch()
  app.get('/stores/:id', store.show); // Backbone.Model.fetch()
  app.get('/stores/:id/edit', store.edit); // looks useless
  app.get('/stores/new', store.new); // looks useless
  app.post('/stores', store.create);
  app.put('/stores/:id', store.update); // Backbone.Model.save()
  app.delete('/stores/:id', store.destroy);

  app.get('/orders', order.index);
  app.get('/settlements', settlement.index);
  app.get('/products', product.index);
};
