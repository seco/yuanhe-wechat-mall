define(['jquery',
    'underscore',
    'backbone',
    'hbs!../../templates/productListTmpl',
    'hbs!../../templates/imageCellTmpl',
    '../collections/ProductCollection',
    'backgrid',
    'backgridpaginator',
    'backgridtextcell',
    'backgridselectall',
    'jqueryext'
  ],
  function($, _, Backbone, productListTmpl, imageCellTmpl, ProductCollection, Backgrid) {

    var StoreView = Backbone.View.extend({
      el: '.content',

      initialize: function() {

        this.products = new ProductCollection();

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
            name: 'weixin_product_info.product_base.name',
            label: '商品名称',
            cell: 'string'
          }, {
            label: '商品图片',
            cell: Backgrid.UriCell.extend({
              render: function() {
                var main_img = this.model.get('weixin_product_info.product_base.main_img');
                if (main_img) {
                  this.$el.html(imageCellTmpl({
                    imgurl: main_img
                  }));
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

          collection: this.products
        });

        this.paginator = new Backgrid.Extension.Paginator({
          collection: this.products
        });

      },

      render: function() {
        var self = this;

        this.$el.html(productListTmpl());

        var sa_flag = $('#role_name').val();
        if (sa_flag === 'superadmin') {
          this.$el.find('button.refresh').removeAttr('disabled');
        };

        this.$el.find('#grid').append(this.grid.render().el);
        this.$el.find('#paginator').append(this.paginator.render().el);

        this.grid.clearSelectedModels();

        this.products.fetch({
          reset: true
        });

      },

      events: {
        'click button.refresh': 'refresh'
      },

      refresh: function() {
        Backbone.ajax({
          type: "post",
          dataType: "json",
          url: "/admin/products/refresh",
          success: function(data, status) {
            $.noty.setText(generate('success').options.id, '刷新成功！');
            this.products.fetch({
              reset: true
            });
          },
          error: function(request, status, error) {
            $.noty.setText(generate('error').options.id, '刷新失败！');
          }
        });
      }


    });

    return StoreView;

  });
