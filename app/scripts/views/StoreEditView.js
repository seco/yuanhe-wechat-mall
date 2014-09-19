define(['jquery',
    'underscore',
    'backbone',
    'hbs!../../templates/storeEditTmpl',
    '../models/StoreModel'
  ],
  function($, _, Backbone, storeEditTmpl, StoreModel) {

    var StoreEditView = Backbone.View.extend({
      el: '.content',

      render: function(opts) {
        var that = this;

        if (opts.id) {
          that.store = new StoreModel({
            id: opts.id
          });

          that.store.fetch({
            success: function(store) {
              that.$el.html(storeEditTmpl(store.toJSON()));
            }
          });

        } else {
          that.$el.html(storeEditTmpl());
        };

      }

    });

    return StoreEditView;

  });
