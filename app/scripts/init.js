require.config({

  baseUrl: "/scripts",

  shim: {
    underscore: {
      exports: '_'
    },
    backbone: {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    },
    jqueryui: ['jquery'],
    jqueryslimscroll: ['jquery'],
    jquerycusttreemenu: ['jquery'],
    jqueryicheck: ['jquery'],
    bootstrap: ['jquery'],
    adminLTE: ['jquery', 'jqueryslimscroll', 'jquerycusttreemenu', 'jqueryicheck', 'jqueryui', 'bootstrap']
  },

  paths: {
    jquery: '../bower_components/jquery/dist/jquery.min',
    jqueryui: '../bower_components/jquery-ui/ui/minified/jquery-ui.min',
    jqueryslimscroll: '../bower_components/jquery-slimscroll/jquery.slimscroll.min',
    jquerycusttreemenu: 'vendor/jquery_cust_treemenu',
    jqueryicheck: '../bower_components/jquery-icheck/icheck.min',
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
