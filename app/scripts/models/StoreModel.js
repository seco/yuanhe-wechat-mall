define([
  'jquery',
  'underscore',
  'backbone'
], function($, _, Backbone) {

  var StoreModel = Backbone.Model.extend({
    urlRoot: '/stores',

    defaults: {
      storeName: '',
      storeType: '',
      storeAddress: '',
      telNum: '',
      contactName: ''
    }
  });

  return StoreModel;

});
