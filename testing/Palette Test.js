/*
*/
(function() {
  // ========================================
  // Header Bar insertion constants
  var SCRIPT_TITLE = 'Palette Test';
  var SCRIPT_VERSION = '0.0.0ß';

  function createWindow () {
    var w = new Window ('palette');
    var m = w.add('statictext');
    m.text = 'Hello, World!';

    return w;
  }

  var win = createWindow()
  win.show();
}());
