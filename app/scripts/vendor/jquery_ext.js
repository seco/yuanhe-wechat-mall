$.fn.serializeObject = function() {
  var o = {};
  var a = this.serializeArray();
  $.each(a, function() {
    if (o[this.name] !== undefined) {
      if (!o[this.name].push) {
        o[this.name] = [o[this.name]];
      }
      o[this.name].push(this.value || '');
    } else {
      o[this.name] = this.value || '';
    }
  });
  return o;
};

function generate(type) {

  var n = noty({
    type: type,
    dismissQueue: true,
    layout: 'topCenter',
    theme: 'bootstrapTheme',
    closeWith: ['button', 'click'],
    maxVisible: 5,
    modal: false,
    timeout: 1000,
    animation: {
      open: {
        opacity: 'toggle'
      },
      close: {
        opacity: 'toggle'
      },
      easing: 'swing',
      speed: 500
    }
  });
  console.log('html: ' + n.options.id);
  return n;
}
