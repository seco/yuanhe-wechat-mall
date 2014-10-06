define([
  'jquery',
  'underscore',
  'backbone',
  'backbone-deep-model'
], function($, _, Backbone) {

  var OrderModel = Backbone.DeepModel.extend({
    urlRoot: '/admin/orders',
    idAttribute: "_id"
  });

  return OrderModel;

});
