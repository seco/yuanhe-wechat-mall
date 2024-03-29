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
    'backbone-deep-model': ['backbone'],
    //'backbone-nested': ['backbone'],
    'backbone.paginator': ['backbone'],
    jqueryui: ['jquery'],
    jqueryext: ['jquery', 'jquerynoty'],
    jqueryslimscroll: ['jquery'],
    jquerycusttreemenu: ['jquery'],
    jqueryicheck: ['jquery'],
    jquerynoty: ['jquery'],
    moment: ['jquery'],
    'bootstrap-daterangepicker': ['jquery', 'moment'],
    bootstrap: ['jquery'],
    adminLTE: ['jquery', 'jqueryslimscroll', 'jquerycusttreemenu', 'jqueryicheck', 'jqueryui', 'bootstrap'],
    backgrid: {
      deps: ['jquery', 'underscore', 'backbone', 'backbone.paginator'],
      exports: 'Backgrid'
    },
    backgridpaginator: ['backgrid'],
    backgridtextcell: ['backgrid'],
    backgridselectall: ['backgrid']
  },

  paths: {
    jquery: '../bower_components/jquery/dist/jquery',
    jqueryext: 'vendor/jquery_ext',
    jqueryui: '../bower_components/jquery-ui/ui/jquery-ui',
    jqueryslimscroll: '../bower_components/jquery-slimscroll/jquery.slimscroll',
    jquerycusttreemenu: 'vendor/jquery_cust_treemenu',
    jqueryicheck: '../bower_components/jquery-icheck/icheck',
    jquerynoty: '../bower_components/noty/js/noty/packaged/jquery.noty.packaged',
    'bootstrap-daterangepicker': '../bower_components/bootstrap-daterangepicker/daterangepicker',
    //daterangepicker: '../js/plugins/daterangepicker/daterangepicker',
    moment: '../bower_components/moment/moment',
    backbone: '../bower_components/backbone/backbone',
    'backbone-deep-model': '../bower_components/backbone-deep-model/distribution/deep-model',
    //'backbone-nested': '../bower_components/backbone-nested/backbone-nested.min',
    'backbone.paginator': '../bower_components/backbone.paginator/lib/backbone.paginator',
    backgrid: 'vendor/backgrid',
    /* bower has issue that it downloads a stale version, therfore we download manually  */
    backgridpaginator: 'vendor/backgrid-paginator',
    backgridtextcell: 'vendor/backgrid-text-cell',
    backgridselectall: 'vendor/backgrid-select-all',
    underscore: '../bower_components/underscore/underscore',

    /* alias the bootstrap js lib */
    bootstrap: '../bower_components/bootstrap/dist/js/bootstrap',

    adminLTE: '../js/AdminLTE/app',

    tmpl: '../templates',
    hbs: '../bower_components/require-handlebars-plugin/hbs'
  },

  hbs: { // optional
    helpers: true, // default: true
    i18n: false, // default: false
    templateExtension: 'hbs', // default: 'hbs'
    partialsUrl: '', // default: ''
    helperPathCallback: function(name) {
      return '../templates/helpers/' + name;
    }
  }

});
