define(['jquery',
    'underscore',
    'backbone',
    'hbs!../../templates/pageheaderTmpl'
  ],
  function($, _, Backbone, pageheaderTmpl) {

    var PageHeaderView = Backbone.View.extend({
      el: '.content-header',

      render: function(env) {
        $(this.el).html(pageheaderTmpl(env));
      }
    });

    return PageHeaderView;
  });
