define([
  'jquery',
  'underscore',
  'backbone',
  'backbone.paginator'
], function($, _, Backbone) {
  var StoreCollection = Backbone.PageableCollection.extend({
    url: "/stores",

    // Initial pagination states
    state: {
      pageSize: 15,
      sortKey: "updated",
      order: 1
    },

    // You can remap the query parameters from `state` keys from
    // the default to those your server supports
    queryParams: {
      totalPages: null,
      totalRecords: null,
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
