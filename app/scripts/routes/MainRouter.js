define(function(require) {
  var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    adminLTE = require('adminLTE'),
    DashboardView = require('../views/DashboardView');


  var MainRouter = Backbone.Router.extend({
    routes: {
      'dashboard': 'showDashboard'
    }
  });

  var initialize = function() {
    //var vent = _.extend({}, Backbone.Events);
    var router = new MainRouter();

    console.log("MainRouter / initialize");

    router.on('route:showDashboard', function() {

      var dashboardView = new DashboardView();
      dashboardView.render();

      console.log("default route");

    });

    Backbone.history.start();


  };

  return {
    initialize: initialize
  };
});
