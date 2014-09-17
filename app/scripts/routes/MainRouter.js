define(['jquery',
    'underscore',
    'backbone',
    '../views/PageHeaderView',
    '../views/DashboardView',
    '../views/StoreView',
    'adminLTE' // adminLTE doesnot need to be exported, must add the end of define
  ],
  function($,
    _,
    Backbone,
    PageHeaderView,
    DashboardView,
    StoreView
  ) {

    var MainRouter = Backbone.Router.extend({
      routes: {
        'dashboard': 'showDashboard',
        'store': 'showStore'
      }
    });

    var renderBasicView = function(env) {
      var pageHeaderModel = new Backbone.Model();
      pageHeaderModel.set(env);
      var pageHeaderView = new PageHeaderView({
        model: pageHeaderModel
      });
      pageHeaderView.render();
    };

    var initialize = function() {
      //var vent = _.extend({}, Backbone.Events);
      var router = new MainRouter();

      console.log("MainRouter / initialize");

      router.on('route:showDashboard', function() {
        var env = {
          'title': '后台面板',
          'titlesmall': '快速入口'
        };
        renderBasicView(env);

        var dashboardView = new DashboardView();
        console.log('Trying to render dashboard view');
        dashboardView.render();

      });

      router.on('route:showStore', function() {
        var env = {
          'title': '查看店铺',
          'titlesmall': '店铺列表'
        };
        renderBasicView(env);

        var storeView = new StoreView();
        console.log('Try to render store view');
        storeView.render();

      });

      Backbone.history.start();

      router.navigate('dashboard', {
        trigger: true
      });

    };

    return {
      initialize: initialize
    };
  });
