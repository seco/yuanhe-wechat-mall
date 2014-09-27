define(['jquery',
    'underscore',
    'backbone',
    'hbs!../../templates/orderListTmpl',
    '../collections/OrderCollection',
    'backgrid',
    'backgridpaginator',
    'backgridtextcell',
    'backgridselectall',
    'jqueryext'
  ],
  function($, _, Backbone, orderListTmpl, OrderCollection, Backgrid) {

    var OrderListView = Backbone.View.extend({
      el: '.content',

      initialize: function() {

        this.orders = new OrderCollection();

        // Override Column defaults globally
        Backgrid.Column.prototype.defaults.sortable = false;

        // Override Column defaults locally
        var MyColumn = Backgrid.Column.extend({
          defaults: _.defaults({
            editable: false,
            sortable: false
          }, Backgrid.Column.prototype.defaults)
        });

        this.grid = new Backgrid.Grid({
          columns: new Backgrid.Columns([{
            name: "",
            cell: "select-row",
            headerCell: "select-all"
          }, {
            name: 'member.member_name',
            label: '会员昵称',
            cell: 'string'
          }, {
            name: 'product.name',
            label: '订单商品',
            cell: 'string'
          }, {
            name: 'payment',
            label: '订单金额',
            cell: 'string'
          }, {
            name: 'order_status',
            label: '商店类型',
            cell: Backgrid.Cell.extend({
              render: function() {
                var val = '';
                var modelVal = this.model.get('order_status');
                if (modelVal === 'created') {
                  val = '已创建';
                } else if (modelVal === 'settled') {
                  val = '已结算';
                }
                this.$el.text(val);
                return this;
              }
            })
          }, {
            name: 'sales_store.store_name',
            label: '店铺名称（销售）',
            cell: 'string'
          }, {
            name: 'member_store.store_name',
            label: '店铺名称（会员）',
            cell: 'string'
          }, {
            name: 'sales_store.commission',
            label: '销售佣金',
            cell: 'string'
          }, {
            name: 'member_store.commission',
            label: '会员佣金',
            cell: 'string'
          }, {
            name: 'created_at',
            label: '订单创建时间',
            cell: Backgrid.DatetimeCell.extend({
              includeMilli: true
            })
          }], {
            model: MyColumn
          }),

          collection: this.orders
        });

        this.paginator = new Backgrid.Extension.Paginator({
          collection: this.orders
        });

        this.on('enter', this.search, this);
      },

      render: function() {
        var self = this;

        this.$el.html(orderListTmpl());

        this.$el.find('#grid').append(this.grid.render().el);
        this.$el.find('#paginator').append(this.paginator.render().el);

        this.$el.find('input').keyup(function(e) {
          if (e.keyCode == 13) {
            self.trigger('enter');
          };
        });

        this.grid.clearSelectedModels();

        this.orders.fetch({
          reset: true
        });

      },

      events: {
        'click button.search': 'search'
      },

      search: function() {
        var searchVal = this.$el.find('[name="table_search"]').val();
        var searchKey = 'store_name';
        this.orders.queryParams.searchKey = searchKey;
        this.orders.queryParams.searchVal = searchVal;
        this.orders.fetch({
          reset: true
        });
      }


    });

    return OrderListView;

  });
