define([
  'jquery',
  'underscore',
  'backbone',
  'backbone-deep-model'
], function($, _, Backbone) {

  var ProductModel = Backbone.DeepModel.extend({
    urlRoot: '/products',
    idAttribute: "_id"
  });

  return ProductModel;

});
