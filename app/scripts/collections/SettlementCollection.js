define([
  'jquery',
  'underscore',
  'backbone',
  '../models/SettlementModel',
  'backbone.paginator'
], function($, _, Backbone, SettlementModel) {
  var SettlementCollection = Backbone.PageableCollection.extend({
    model: SettlementModel,
    url: "/admin/settlements",

    // Initial pagination states
    state: {
      pageSize: 25,
      sortKey: "created_at",
      order: 1
    },

    // You can remap the query parameters from `state` keys from the default to those your server supports
    /*{
      currentPage: "page",
      pageSize: "per_page",
      totalPages: "total_pages",
      totalRecords: "total_entries",
      sortKey: "sort_by",
      order: "order",
      directions: {
        "-1": "asc",
        "1": "desc"
      }
    }*/
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

  return SettlementCollection;
});
