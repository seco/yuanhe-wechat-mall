define([
  'jquery',
  'underscore',
  'backbone',
  '../models/ProductModel',
  'backbone.paginator'
], function($, _, Backbone, ProductModel) {
  var ProductCollection = Backbone.PageableCollection.extend({
    model: ProductModel,
    url: "/products",

    // Initial pagination states
    state: {
      pageSize: 25,
      sortKey: "created_at",
      order: 1
    },

    queryParams: {
      //totalPages: null,
      //totalRecords: null,
      sortKey: "sort" //sort=created_at
      //q: "state:closed repo:jashkenas/backbone"
    },

    // get the state from Github's search API result
    parseState: function(resp, queryParams, state, options) {
      return {
        totalRecords: resp.total_count
      };
    },

    // get the actual records
    parseRecords: function(resp, options) {
      return resp.items;
    }
  });

  return ProductCollection;
});
