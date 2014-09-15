define(function(require) {
  var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    adminLTE = require('adminLTE'),
    dashboardTmpl = require('hbs!../../templates/dashboard');

  var DashboardView = Backbone.View.extend({
    el: '.content',

    render: function() {
      $(this.el).html(dashboardTmpl());
    }
  });

  return DashboardView;
});
