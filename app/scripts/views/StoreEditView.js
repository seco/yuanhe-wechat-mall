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

      },

      save: function(event) {
        event.preventDefault();
        var storeForm = $(event.currentTarget).serializeObject();
        console.log(storeForm);
        var store = new StoreModel();
        store.save(storeForm, {
          success: function(store, res) {
            console.log('suc');
            console.log(store);
            console.log(res);
          },
          error: function(store, res){
            console.log('err');
            console.log(res);
          }
        });

      }

    });

    return StoreEditView;

  });
