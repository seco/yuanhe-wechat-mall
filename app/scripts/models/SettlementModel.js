define([
  'jquery',
  'underscore',
  'backbone'
], function($, _, Backbone) {

  var SettlementModel = Backbone.Model.extend({
    urlRoot: '/settlements',
    idAttribute: "_id"
  });

  return SettlementModel;

});
