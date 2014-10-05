define(['jquery',
    'underscore',
    'backbone',
    'hbs!../../templates/storeListTmpl',
    'hbs!../../templates/qrcodeTmpl',
    '../collections/StoreCollection',
    'backgrid',
    'backgridpaginator',
    'backgridtextcell',
    'backgridselectall',
    'jqueryext'
  ],
  function($, _, Backbone, storeListTmpl, qrcodeTmpl, StoreCollection, Backgrid) {

    var StoreView = Backbone.View.extend({
      el: '.content',

      initialize: function() {

        this.stores = new StoreCollection();

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
            name: 'alias',
            label: '昵称',
            cell: 'string'
          }, {
            name: 'store_name',
            label: '店铺名称',
            cell: 'string'
          }, {
            name: 'store_type',
            label: '商店类型',
            cell: Backgrid.Cell.extend({
              render: function() {
                var val = '';
                var modelVal = this.model.get('store_type');
                if (modelVal === 'physical') {
                  val = '实体店';
                } else if (modelVal === 'virtual') {
                  val = '虚拟店';
                }
                this.$el.text(val);
                return this;
              }
            })
          }, {
            name: 'store_address',
            label: '地址',
            cell: 'string'
          }, {
            name: 'telnum',
            label: '联系电话',
            cell: 'string'
          }, {
            name: 'contact_name',
            label: '联系人',
            cell: 'string'
          }, {
            label: '二维码',
            cell: Backgrid.UriCell.extend({
              render: function() {
                var scene_id = this.model.get('scene_id');
                if (scene_id) {
                  this.$el.html(qrcodeTmpl(this.model.attributes));
                }
                return this;
              }
            })
          }, {
            name: 'created_at',
            label: '关注时间',
            cell: Backgrid.DatetimeCell.extend({
              includeMilli: false
            })
          }], {
            model: MyColumn
          }),

          collection: this.stores
        });

        this.paginator = new Backgrid.Extension.Paginator({
          collection: this.stores
        });

        this.on('enter', this.search, this);
      },

      render: function() {
        var self = this;

        this.$el.html(storeListTmpl());

        var sa_flag = $('#role_name').val();
        if (sa_flag === 'superadmin') {
          this.$el.find('button.edit').removeAttr('disabled');
        };

        this.$el.find('#grid').append(this.grid.render().el);
        this.$el.find('#paginator').append(this.paginator.render().el);

        this.$el.find('input').keyup(function(e) {
          if (e.keyCode == 13) {
            self.trigger('enter');
          };
        });

        this.grid.clearSelectedModels();

        this.stores.fetch({
          reset: true
        });

      },

      events: {
        'click button.create': 'create',
        'click button.edit': 'edit',
        'click button.delete': 'delete',
        'click button.search': 'search'
      },

      create: function() {
        this.goTo('stores/new');
      },

      edit: function() {
        var selModels = this.grid.getSelectedModels();
        if (selModels && selModels.length === 1) {
          this.goTo('stores/' + selModels[0].id + '/edit');
        } else {
          this.grid.clearSelectedModels();
          $.noty.setText(generate('warning').options.id, '请选择单项！');
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
      },

      search: function() {
        var searchVal = this.$el.find('[name="table_search"]').val();
        var searchKey = 'store_name';
        this.stores.queryParams.searchKey = searchKey;
        this.stores.queryParams.searchVal = searchVal;
        this.stores.fetch({
          reset: true
        });
      }


    });

    return StoreView;

  });
