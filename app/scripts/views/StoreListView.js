define(['jquery',
    'underscore',
    'backbone',
    'hbs!../../templates/storeListTmpl',
    '../collections/StoreCollection',
    'backgrid',
    'backgridpaginator',
    'backgridtextcell',
    'backgridselectall'
  ],
  function($, _, Backbone, storeListTmpl, StoreCollection, Backgrid) {

    var StoreView = Backbone.View.extend({
      el: '.content',

      initialize: function() {

        this.stores = new StoreCollection();
      },

      render: function() {

        this.grid = new Backgrid.Grid({
          columns: [{
            name: "",
            cell: "select-row",
            headerCell: "select-all"
          }, {
            name: 'id',
            label: '序号',
            cell: Backgrid.IntegerCell.extend({
              orderSeparator: ''
            }),
            sortable: false,
            editable: false
          }, {
            name: 'alias',
            label: '昵称',
            cell: 'string',
            sortable: false,
            editable: false
          }, {
            name: 'store_name',
            label: '店铺名称',
            cell: 'string', // See the TextCell extension
            sortable: false,
            editable: false
          }, {
            name: 'store_type',
            label: '商店类型',
            cell: 'string', // See the TextCell extension
            sortable: false,
            editable: false
          }, {
            name: 'store_address',
            label: '地址',
            cell: 'string',
            sortable: false,
            editable: false
          }, {
            name: 'contact_name',
            label: '联系人',
            cell: 'string',
            sortable: false,
            editable: false
          }, {
            name: 'created_at',
            label: '关注时间',
            cell: 'string',
            sortable: false,
            editable: false
          }],

          collection: this.stores
        });

        this.paginator = new Backgrid.Extension.Paginator({
          collection: this.stores
        });

        this.$el.html(storeListTmpl());

        this.$el.find('#grid').append(this.grid.render().el);
        this.$el.find('#paginator').append(this.paginator.render().el);

        this.stores.fetch({
          reset: true
        });

      },

      events: {
        'click button.create': 'create',
        'click button.edit': 'edit',
        'click button.delete': 'delete'
      },

      create: function() {
        this.goTo('stores/new');
      },

      edit: function() {
        var selModels = this.grid.getSelectedModels();
        if (selModels && selModels.length === 1) {
          this.goTo('stores/' + selModels[0].id + '/edit');
        }
      },

      delete: function() {
        _.each(this.grid.getSelectedModels(), function(model) {
          model.destroy({
            success: function(model, res) {
              console.log('suc');
            },
            error: function(model, res) {
              console.log('fail');
            }
          });
        });
      }

    });

    return StoreView;

  });
