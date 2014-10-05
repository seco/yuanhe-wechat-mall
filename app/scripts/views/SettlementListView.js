define(['jquery',
    'underscore',
    'backbone',
    'hbs!../../templates/settlementListTmpl',
    '../collections/SettlementCollection',
    'backgrid',
    'backgridpaginator',
    'backgridtextcell',
    'backgridselectall',
    'jqueryext'
  ],
  function($, _, Backbone, settlementListTmpl, SettlementCollection, Backgrid) {

    var SettlementListView = Backbone.View.extend({
      el: '.content',

      initialize: function() {

        this.settlements = new SettlementCollection();

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
            name: 'store_name',
            label: '店铺名称',
            cell: 'string'
          }, {
            name: 'commission',
            label: '佣金（销售+会员）',
            cell: 'number'
          }], {
            model: MyColumn
          }),

          collection: this.settlements
        });

        this.paginator = new Backgrid.Extension.Paginator({
          collection: this.settlements
        });

        this.on('enter', this.search, this);
      },

      render: function() {
        var self = this;

        this.$el.html(settlementListTmpl());

        //init daterangepricker
        this.$el.find('#settlement_range').daterangepicker({
          locale: {
            cancelLabel: 'Clear'
          }
        });
        this.$el.find('#settlement_range').on('cancel.daterangepicker', function(ev, picker) {
          $(ev.currentTarget).val('');
          var q = self.settlements.queryParams;
          delete q.startDate;
          delete q.endDate;
          delete q.calendarKey;
        });
        this.$el.find('#settlement_range').on('apply.daterangepicker', function(ev, picker) {
          var startDate = picker.startDate.format('YYYY-MM-DD');
          var endDate = picker.endDate.format('YYYY-MM-DD');
          var calendarKey = 'created_at';
          var q = self.settlements.queryParams;
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

      },

      events: {
        'click button.searchSettlement': 'search'
      },

      search: function() {
        this.settlements.fetch({
          reset: true
        });
      }

    });

    return SettlementListView;

  });
