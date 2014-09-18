/**
 * routes
 */

// Load the route handlers
var routes = require('./handlers');
var oauth = require('./handlers/oauth');

module.exports = function(app) {

  // Define the routes
  app.get('/', routes.index);
  app.get('/oauth_response.php', oauth.response);

}
