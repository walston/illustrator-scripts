/*
*/
(function() {
  // ========================================
  // Header Bar insertion constants
  var SCRIPT_TITLE = 'Dialog Test';
  var SCRIPT_VERSION = '0.0.0ß';
  var sel = app.activeDocument.selection;

  // Define mainDialog()
  function mainDialog() {
    this.init();
    return this;
  };
  mainDialog.prototype.init = function() {

    var unit = 20;
    var thisObj = this;

    thisObj.dlg = new Window('dialog', SCRIPT_TITLE + ' - ver.' + SCRIPT_VERSION);
    thisObj.dlg.margins = [unit, unit, unit, unit];
    // Nathan's best guesswork
    thisObj.dlg.alignment = 'left';
    thisObj.dlg.orientation = 'column';
    thisObj.inputGroup = thisObj.dlg.add('group', undefined);
    thisObj.inputGroup.alignment = 'left';
    thisObj.inputGroup.orientation = 'column';
    thisObj.inputGroup.alignChildren = 'left';
    thisObj.inputGroup.add('statictext', undefined, 'Job Number:');
    var ArtNumber = thisObj.inputGroup.add('edittext', undefined, 'Example - JRS-M000');
    thisObj.inputGroup.add('statictext', undefined, 'Pad Print Number:');
    var PadPrintNumber = thisObj.inputGroup.add('edittext', undefined, 'Example - PD-999');
    thisObj.buttonGroup = thisObj.dlg.add('group', undefined);
    thisObj.cancel = 
      thisObj.buttonGroup.add('button', undefined, 'Cancel', {name: 'cancel'});
    thisObj.ok = thisObj.buttonGroup.add('button', undefined, 'OK', { name:'ok'});
    thisObj.ok.onClick = function() {
			try {
				//PROCEDURAL FUNCTIONS
				alert( 
						newText( ArtNumber.text , PadPrintNumber.text)
						);
			} catch(e) {
				alert('Error! Script has crashed!\nError: ' + e);
			} finally {
				thisObj.closeDialog();
			}
		}
		thisObj.cancel.onClick = function() {
			thisObj.closeDialog();
		}
  };
  
  mainDialog.prototype.showDialog = function() {
    this.dlg.show();
  };
  mainDialog.prototype.closeDialog = function() {
    this.dlg.close();
  };
  var dialog = new mainDialog();
  dialog.showDialog();
  

  // adjust to take textRange as argument
  function newText() {

    var myCharStyle = {


    }

	  var length = arguments.length;
    var v = '';
	  for (i=0;i<length;i++){
      v += arguments[i].toString() + '\r'
    }
    v += '|\r|';
    return v;
  }
  

}());
