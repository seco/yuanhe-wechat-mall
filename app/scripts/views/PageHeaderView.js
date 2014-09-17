define(['jquery',
    'underscore',
    'backbone',
    'hbs!../../templates/pageheaderTmpl'
  ],
  function($, _, Backbone, pageheaderTmpl) {

    var PageHeaderView = Backbone.View.extend({
      el: '.content-header',

      render: function() {
        $(this.el).html(pageheaderTmpl(this.model.toJSON()));
      }
    });

    return PageHeaderView;
  });
