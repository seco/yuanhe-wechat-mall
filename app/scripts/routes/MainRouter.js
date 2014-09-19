define(['jquery',
    'underscore',
    'backbone',
    '../views/PageHeaderView',
    '../views/DashboardView',
    '../views/StoreListView',
    '../views/StoreEditView',
    'adminLTE' // adminLTE doesnot need to be exported, must add the end of define
  ],
  function($,
    _,
    Backbone,
    PageHeaderView,
    DashboardView,
    StoreListView,
    StoreEditView
  ) {

    var MainRouter = Backbone.Router.extend({
      routes: {
        'dashboard': 'showDashboard',
        'stores': 'showStoreList',
        'stores/new': 'showStoreEdit',
        'stores/:id/edit': 'showStoreEdit',
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

      var pageHeaderView = new PageHeaderView();
      var dashboardView = new DashboardView();
      var storeListView = new StoreListView();
      var storeEditView = new StoreEditView();

      router.on('route:showDashboard', function() {
        var env = {
          'title': '后台面板',
          'titlesmall': '快速入口'
        };

        pageHeaderView.render(env);
        dashboardView.render();

      });

      router.on('route:showStoreList', function() {
        var env = {
          'title': '查看店铺',
          'titlesmall': '店铺列表'
        };

        pageHeaderView.render(env);
        storeListView.render();

      });

      router.on('route:showStoreEdit', function(id) {
        var env = {
          'title': '编辑店铺',
          'titlesmall': '店铺信息'
        };

        pageHeaderView.render(env);
        storeEditView.render({
          id: id
        });

      });

      Backbone.history.start();

    };

    return {
      initialize: initialize
    };
  });
