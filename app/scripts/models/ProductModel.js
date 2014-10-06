define([
  'jquery',
  'underscore',
  'backbone',
  'backbone-deep-model'
], function($, _, Backbone) {

  var ProductModel = Backbone.DeepModel.extend({
    urlRoot: '/admin/products',
    idAttribute: "_id"
  });

  return ProductModel;

});
