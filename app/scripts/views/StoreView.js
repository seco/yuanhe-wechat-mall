define(['jquery',
    'underscore',
    'backbone',
    'hbs!../../templates/storeTmpl',
    '../collections/StoreCollection',
    'backgrid',
    'backgridpaginator',
    'backgridtextcell'
  ],
  function($, _, Backbone, storeTmpl, StoreCollection, Backgrid) {

    var StoreView = Backbone.View.extend({
      el: '.content',

      render: function() {
        var stores = new StoreCollection();

        var grid = new Backgrid.Grid({
          columns: [{
            name: "id",
            cell: Backgrid.IntegerCell.extend({
              orderSeparator: ''
            }),
            sortable: false,
            editable: false
          }, {
            name: "title",
            cell: "string",
            sortable: false,
            editable: false
          }, {
            name: "body",
            cell: "text", // See the TextCell extension
            sortable: false
          }, {
            name: "comments",
            cell: "integer"
          }],

          collection: stores
        });

        var paginator = new Backgrid.Extension.Paginator({
          collection: stores
        });

        $(this.el).html(storeTmpl());

        $("#grid").append(grid.render().$el);
        $("#paginator").append(paginator.render().$el);

        stores.fetch({
          reset: true
        });

      }
    });

    return StoreView;

  });
