/**
 * routes
 */

// Load the route handlers
var routes = require('./handlers');
var oauth = require('./handlers/oauth');
var store = require('./handlers/store');
var sign = require('./handlers/sign');

module.exports = function(app) {

  // Define the routes
  app.get('/', routes.index);
  app.get('/oauth_response.php', oauth.response);

  app.get('/login', sign.login);
  app.get('/register', sign.register);

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
  app.get('/stores', store.index); //Backbone.Collection.fetch()
  app.get('/stores/:id', store.show); // Backbone.Model.fetch()
  app.get('/stores/:id/edit', store.edit); // looks useless
  app.get('/stores/new', store.new); // looks useless
  app.post('/stores', store.create);
  app.put('/stores/:id', store.update);
  app.delete('/stores/:id', store.destroy);
};
