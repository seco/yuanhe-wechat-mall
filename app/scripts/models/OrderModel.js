define([
  'jquery',
  'underscore',
  'backbone',
  'backbone-deep-model'
], function($, _, Backbone) {

  var OrderModel = Backbone.DeepModel.extend({
    urlRoot: '/orders',
    idAttribute: "_id"
  });

  return OrderModel;

});
