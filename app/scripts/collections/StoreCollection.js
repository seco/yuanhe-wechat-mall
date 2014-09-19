define([
  'jquery',
  'underscore',
  'backbone',
  '../models/StoreModel',
  'backbone.paginator'
], function($, _, Backbone, StoreModel) {
  var StoreCollection = Backbone.PageableCollection.extend({
    model: StoreModel,
    url: "/stores",

    // Initial pagination states
    state: {
      pageSize: 25,
      sortKey: "dateCreated",
      order: 1
    },

    // You can remap the query parameters from `state` keys from
    // the default to those your server supports
    queryParams: {
      //totalPages: null,
      //totalRecords: null,
      sortKey: "sort",
      q: "state:closed repo:jashkenas/backbone"
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

  return StoreCollection;
});
