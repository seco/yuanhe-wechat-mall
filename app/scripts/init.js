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
    'backbone.paginator': ['backbone'],
    jqueryui: ['jquery'],
    jqueryslimscroll: ['jquery'],
    jquerycusttreemenu: ['jquery'],
    jqueryicheck: ['jquery'],
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
    jquery: '../bower_components/jquery/dist/jquery.min',
    jqueryui: '../bower_components/jquery-ui/ui/minified/jquery-ui.min',
    jqueryslimscroll: '../bower_components/jquery-slimscroll/jquery.slimscroll.min',
    jquerycusttreemenu: 'vendor/jquery_cust_treemenu',
    jqueryicheck: '../bower_components/jquery-icheck/icheck.min',
    backbone: '../bower_components/backbone/backbone',
    'backbone.paginator': '../bower_components/backbone.paginator/lib/backbone.paginator.min',
    backgrid: '../bower_components/backgrid/lib/backgrid.min',
    /* bower has issue that it downloads a stale version, therfore we download manually  */
    backgridpaginator: 'vendor/backgrid-paginator.min',
    backgridtextcell: '../bower_components/backgrid-text-cell/backgrid-text-cell.min',
    backgridselectall: '../bower_components/backgrid-select-all/backgrid-select-all.min',
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
