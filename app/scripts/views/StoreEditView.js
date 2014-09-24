define(['jquery',
    'underscore',
    'backbone',
    'hbs!../../templates/storeEditTmpl',
    '../models/StoreModel',
    'jqueryext'
  ],
  function($, _, Backbone, storeEditTmpl, StoreModel) {

    var StoreEditView = Backbone.View.extend({
      el: '.content',

      events: {
        'submit form': 'save'
      },

      render: function(opts) {
        var that = this;

        if (opts.id) {
          that.store = new StoreModel({
            _id: opts.id
          });

          that.store.fetch({
            success: function(res) {
              var store = new StoreModel(res);
              that.$el.html(storeEditTmpl(store.attributes.toJSON()));
            }
          });

        } else {
          that.$el.html(storeEditTmpl());
        };

      },

      save: function(event) {
        event.preventDefault();
        var self = this;
        var storeForm = $(event.currentTarget).serializeObject();
        console.log(storeForm);
        var store = new StoreModel();
        store.save(storeForm, {
          success: function(store, res) {
            console.log('suc');
            self.goTo('stores');
          },
          error: function(store, res) {
            console.log('err');
          }
        });

      }

    });

    return StoreEditView;

  });
