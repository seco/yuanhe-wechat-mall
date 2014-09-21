define(['hbs/handlebars',
    'jquery'
  ],
  function(Handlebars, $) {
    function myhelper(value, options) {
      var $el = $('<select />').html(options.fn(this));
      $el.find('[value=' + value + ']').attr({
        'selected': 'selected'
      });
      return $el.html();
    }

    Handlebars.registerHelper("select", myhelper);
    return myhelper;
  });
