doc = app.activeDocument,
sel = doc.selection;
replacementText = replacementTextPrompt() ;
// alert(sel)

if (sel != null && (replacementText != null )) {
	for (i=0;i<sel.length;i++) {
		try {
			sel[i].contents = replacementText;
		} catch(e){null}
	}
}

function replacementTextPrompt () {

	var w = new Window('dialog', 'Replacement Text', undefined, undefined);
		w.alignChildren = 'fill';
	var inputField = w.add('edittext', [0, 0, 170, 80], '', {multiline: true, wantReturn: true});
		inputField.active = true;
	var buttonGroup = w.add('group');
		buttonGroup.alignment = 'right';
	var ok = buttonGroup.add('button', undefined, 'OK');
	var cancel = buttonGroup.add('button', undefined, 'Cancel');

	if (w.show () == 1 && inputField.text != ''){
		return inputField.text;
	} else {
		return null;
	}
}