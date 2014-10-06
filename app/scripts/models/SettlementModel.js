define([
  'jquery',
  'underscore',
  'backbone'
], function($, _, Backbone) {

  var SettlementModel = Backbone.Model.extend({
    urlRoot: '/admin/settlements',
    idAttribute: "_id"
  });

  return SettlementModel;

});
