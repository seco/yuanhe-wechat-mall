define([
  'jquery',
  'underscore',
  'backbone'
], function($, _, Backbone) {

  var StoreModel = Backbone.Model.extend({
    urlRoot: '/stores'
  });

  return StoreModel;

});
