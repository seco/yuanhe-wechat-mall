define([
  'jquery',
  'underscore',
  'backbone'
], function($, _, Backbone) {

  var StoreModel = Backbone.Model.extend({
    urlRoot: '/stores',
    idAttribute: "_id"
  });

  return StoreModel;

});
