/**
 * Routes
 *
 * @author Bobby Tang, Minix Li
 */

// load the route handlers
var routes = require('./handlers');

var gateway = require('./handlers/weixin/message/gateway');
var oauth = require('./handlers/weixin/oauth');
var qrcode = require('./handlers/qrcode');
var adminOrder = require('./handlers/admin/order');
var adminProduct = require('./handlers/admin/product');
var adminSettlement = require('./handlers/admin/settlement');
var adminSign = require('./handlers/admin/sign');
var adminStore = require('./handlers/admin/store');

module.exports = function(app) {

  // message from weixin mall public number
  app.get('/weixin/message/mall', gateway.access);
  app.post('/weixin/message/mall', gateway.receive);

  // message from store weixin public number
  app.get('/weixin/message/store', gateway.access);
  app.post('/weixin/message/store', gateway.receive);

  // product list page
  app.get('/products', product.index);
  // product show page
  app.get('/products/:store_openid/:product_openid', product.show);
  // product promotion page
  app.get('/products/:store_openid/:product_openid/promotion', product.promotion);

  // brand list page
  app.get('/brands', brand.index);
  // brand show page
  app.get('/brands/:id', brand.show);
  // brand promotion page
  app.get('/brands/:id/promotion', brand.promotion);

  // qrcode show pages
  app.get('/qrcode/scene_id/:scene_id', qrcode.withSceneId);
  app.get('/qrcode/url/:url', qrcode.withUrl);

  // admin auth (order sensitive)
  app.get('/admin/login', adminSign.login);
  app.post('/admin/signin', adminSign.signin);
  app.get('/admin/signout', adminSign.signout);

  // routes below need auth
  app.all('*', adminSign.checkAuth);

  // manage page
  app.get('/admin', routes.index);

  /**
   * RESTful API usage
   *
   * GET        /forums              ->  index
   * GET        /forums/new          ->  new
   * POST       /forums              ->  create
   * GET        /forums/:id          ->  show
   * GET        /forums/:id/edit     ->  edit
   * PUT        /forums/:id          ->  update
   * DELETE     /forums/:id          ->  destroy
   */

  // admin stores
  app.get('/admin/stores', adminStore.index);         // Backbone.Collection.fetch()
  app.get('/admin/stores/:id', adminStore.show);      // Backbone.Model.fetch()
  app.get('/admin/stores/:id/edit', adminStore.edit); // seems useless
  app.get('/admin/stores/new', adminStore.new);       // seems useless
  app.post('/admin/stores', adminStore.create);
  app.put('/admin/stores/:id', adminStore.update);    // Backbone.Model.save()
  app.delete('/admin/stores/:id', adminStore.destroy);

  // admin products
  app.get('/admin/products', adminProduct.index);
  // refresh products
  app.post('/admin/products/refresh', adminProduct.refresh);

  // admin orders
  app.get('/admin/orders', adminOrder.index);

  // admin settlements
  app.get('/admin/settlements', adminSettlement.index);

};
