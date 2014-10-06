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

var adminStore = require('./handlers/admin/store');
var adminOrder = require('./handlers/admin/order');
var adminSettlement = require('./handlers/admin/settlement');
var adminSign = require('./handlers/admin/sign');

module.exports = function(app) {

  // auth(order sensitive)
  app.get('/login', adminSign.login);
  app.post('/signin', adminSign.signin);
  app.get('/signout', adminSign.signout);

  // message from weixin mall public number
  app.get('/weixin/message/mall', gateway.access);
  app.post('/weixin/message/mall', gateway.receive);
  // message from store weixin public number
  app.get('/weixin/message/store', gateway.access);
  app.post('/weixin/message/store', gateway.receive);

  // weixin OAuth
  app.get('/oauth_response/product/:store_id/:product_id', oauth.product);

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
    res.render('linked_items');
  });
  /**
   * enable auth
   * below url need auth
   */
  app.all('*', adminSign.checkAuth);
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
  app.get('/stores', adminStore.index); // Backbone.Collection.fetch()
  app.get('/stores/:id', adminStore.show); // Backbone.Model.fetch()
  app.get('/stores/:id/edit', adminStore.edit); // looks useless
  app.get('/stores/new', adminStore.new); // looks useless
  app.post('/stores', adminStore.create);
  app.put('/stores/:id', adminStore.update); // Backbone.Model.save()
  app.delete('/stores/:id', adminStore.destroy);

  app.get('/orders', adminOrder.index);
  app.get('/settlements', adminSettlement.index);
  app.get('/products', adminProduct.index);
};
