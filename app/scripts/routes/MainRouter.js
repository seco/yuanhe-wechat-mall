define(['jquery',
    'underscore',
    'backbone',
    '../views/PageHeaderView',
    '../views/DashboardView',
    '../views/StoreListView',
    '../views/StoreEditView',
    '../views/OrderListView',
    '../views/SettlementListView',
    '../views/ProductListView',
    'adminLTE' // adminLTE doesnot need to be exported, must add the end of define
  ],
  function($,
    _,
    Backbone,
    PageHeaderView,
    DashboardView,
    StoreListView,
    StoreEditView,
    OrderListView,
    SettlementListView,
    ProductListView
  ) {

    var MainRouter = Backbone.Router.extend({
      routes: {
        'dashboard': 'showDashboard',
        'stores': 'showStoreList',
        'stores/new': 'showStoreEdit',
        'stores/:id/edit': 'showStoreEdit',
        'orders': 'showOrderList',
        'settlements': 'showSettlementList',
        'products': 'showProductList',
        '*action': 'showDashboard'
      }
    });

    var initialize = function() {
      //var vent = _.extend({}, Backbone.Events);
      var router = new MainRouter();

      console.log("MainRouter / initialize");

      // this is a workaround, enable view to call router
      // in order to prevent circular dependency in requrejs
      Backbone.View.prototype.goTo = function(fragment) {
        router.navigate(fragment, {
          trigger: true
        });
      };

      var menu = {
        dashboard: {
          'title': '后台面板',
          'titlesmall': '快速入口'
        },
        storeList: {
          'title': '查看店铺',
          'titlesmall': '店铺列表'
        },
        storeEdit: {
          'title': '编辑店铺',
          'titlesmall': '店铺信息'
        },
        orderList: {
          'title': '查看订单',
          'titlesmall': '订单列表'
        },
        settlementList: {
          'title': '佣金结算',
          'titlesmall': '结算信息'
        },
        productList: {
          'title': '查看商品',
          'titlesmall': '商品列表'
        }
      };

      var pageHeaderView = new PageHeaderView();
      var dashboardView = new DashboardView();
      var storeListView = new StoreListView();
      var storeEditView = new StoreEditView();
      var orderListView = new OrderListView();
      var settlementListView = new SettlementListView();
      var productListView = new ProductListView();

      router.on('route:showDashboard', function() {
        pageHeaderView.render(menu.dashboard);
        dashboardView.render();

      });

      router.on('route:showStoreList', function() {
        pageHeaderView.render(menu.storeList);
        storeListView.render();

      });

      router.on('route:showStoreEdit', function(id) {
        pageHeaderView.render(menu.storeEdit);
        storeEditView.render({
          id: id
        });

      });

      router.on('route:showOrderList', function() {
        pageHeaderView.render(menu.orderList);
        orderListView.render();

      });

      router.on('route:showSettlementList', function() {
        pageHeaderView.render(menu.settlementList);
        settlementListView.render();

      });

      router.on('route:showProductList', function() {
        pageHeaderView.render(menu.productList);
        productListView.render();

      });

      Backbone.history.start();

    };

    return {
      initialize: initialize
    };
  });
