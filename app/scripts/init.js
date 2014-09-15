require.config({

  shim: {
    underscore: {
      exports: '_'
    },
    backbone: {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    },
    jqueryui: {
      deps: ['jquery'],
      exports: '$'
    },
    bootstrap: {
      deps: ['jquery'],
      exports: '$'
    },
    adminLTE: {
      deps: ['jquery', 'jqueryui', 'bootstrap'],
      exports: 'adminLTE'
    }
  },

  paths: {
    jquery: '../bower_components/jquery/dist/jquery.min',
    jqueryui: '../bower_components/jquery-ui/ui/minified/jquery-ui.min',
    backbone: '../bower_components/backbone/backbone-min',
    underscore: '../bower_components/underscore/underscore-min',

    /* alias the bootstrap js lib */
    bootstrap: '../js/bootstrap.min',

    adminLTE: '../js/AdminLTE/app',

    tmpl: '../templates',
    hbs: '../bower_components/require-handlebars-plugin/hbs'
  },

  hbs: { // optional
    helpers: true, // default: true
    i18n: false, // default: false
    templateExtension: 'hbs', // default: 'hbs'
    partialsUrl: '' // default: ''
  }

});
