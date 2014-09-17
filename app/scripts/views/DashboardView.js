define(['jquery',
    'underscore',
    'backbone',
    'hbs!../../templates/dashboardTmpl'
  ],
  function($, _, Backbone, dashboardTmpl) {

    var DashboardView = Backbone.View.extend({
      el: '.content',

      render: function() {
        $(this.el).html(dashboardTmpl());
      }
    });

    return DashboardView;
  });
