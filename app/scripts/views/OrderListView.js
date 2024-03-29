define(['jquery',
    'underscore',
    'backbone',
    'hbs!../../templates/orderListTmpl',
    '../collections/OrderCollection',
    'backgrid',
    'backgridpaginator',
    'backgridtextcell',
    'backgridselectall',
    'jqueryext',
    'bootstrap-daterangepicker'
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
            name: 'member.member_name',
            label: '会员昵称',
            cell: 'string'
          }, {
            name: 'weixin_order_info.product_name',
            label: '订单商品',
            cell: 'string'
          }, {
            name: 'weixin_order_info.order_total_price',
            label: '订单金额',
            cell: 'number'
          }, {
            label: '店铺名称（销售）',
            cell: Backgrid.Cell.extend({
              render: function() {
                var storesAry = this.model.get('stores');
                var self = this;
                if (storesAry) {
                  storesAry.forEach(
                    function(store) {
                      if (store.store_type && store.store_type === 'sales') {
                        self.$el.text(store.store_name);
                      }
                    }
                  );
                }
                return this;
              }
            })
          }, {
            label: '店铺名称（会员）',
            cell: Backgrid.Cell.extend({
              render: function() {
                var storesAry = this.model.get('stores');
                var self = this;
                if (storesAry) {
                  storesAry.forEach(
                    function(store) {
                      if (store.store_type && store.store_type === 'channel') {
                        self.$el.text(store.store_name);
                      }
                    }
                  );
                }
                return this;
              }
            })
          }, {
            label: '销售佣金',
            cell: Backgrid.Cell.extend({
              render: function() {
                var storesAry = this.model.get('stores');
                var self = this;
                if (storesAry) {
                  storesAry.forEach(
                    function(store) {
                      if (store.store_type && store.store_type === 'sales') {
                        self.$el.text(store.commission);
                      }
                    }
                  );
                }
                return this;
              }
            })
          }, {
            label: '会员佣金',
            cell: Backgrid.Cell.extend({
              render: function() {
                var storesAry = this.model.get('stores');
                var self = this;
                if (storesAry) {
                  storesAry.forEach(
                    function(store) {
                      if (store.store_type && store.store_type === 'channel') {
                        self.$el.text(store.commission);
                      }
                    }
                  );
                }
                return this;
              }
            })
          }, {
            name: 'created_at',
            label: '订单创建时间',
            cell: Backgrid.DatetimeCell.extend({
              includeMilli: false
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

        //init daterangepricker
        this.$el.find('#reservation').daterangepicker({
          locale: {
            cancelLabel: 'Clear'
          }
        });
        this.$el.find('#reservation').on('cancel.daterangepicker', function(ev, picker) {
          $(ev.currentTarget).val('');
          var q = self.orders.queryParams;
          delete q.startDate;
          delete q.endDate;
          delete q.calendarKey;
        });
        this.$el.find('#reservation').on('apply.daterangepicker', function(ev, picker) {
          var startDate = picker.startDate.format('YYYY-MM-DD');
          var endDate = picker.endDate.format('YYYY-MM-DD');
          var calendarKey = 'created_at';
          var q = self.orders.queryParams;
          q.startDate = startDate;
          q.endDate = endDate;
          q.calendarKey = calendarKey;
        });


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
        'click button.searchOrder': 'search'
      },

      search: function() {
        var searchKey = 'stores.store_name';
        var searchVal = this.$el.find('[name="table_search"]').val();
        this.orders.queryParams.searchKey = searchKey;
        this.orders.queryParams.searchVal = searchVal;
        this.orders.fetch({
          reset: true
        });
      }


    });

    return OrderListView;

  });
