/**
 * routes
 */

// Load the route handlers
var routes = require('./handlers');

var message = require('./handlers/weixin/message');
var oauth = require('./handlers/weixin/oauth');

var qrcode = require('./handlers/qrcode');

var store = require('./handlers/store');
var order = require('./handlers/order');
var sign = require('./handlers/sign');

module.exports = function(app) {

  // auth(order sensitive)
  app.get('/login', sign.login);
  app.post('/signin', sign.signin);
  app.get('/signout', sign.signout);
  app.all('*', sign.checkAuth);
  // manager
  app.get('/', routes.index);

  // weixin message
  app.get('/weixin/message/receive', message.access);
  app.post('/weixin/message/receive', message.receive);

  // weixin OAuth
  app.get('/oauth_response/product/:store_id/:product_id', oauth.product);

  // QR code
  app.get('/qrcode/scene_id/:scene_id', qrcode.showWithSceneId);
  app.get('/qrcode/url/:url', qrcode.showWithUrl);

  // product
  app.get('/product/:store_id/:product_id', product.show);
  app.get('/product/promotion/:store_id/:product_id', product.promotion);


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
};
