
if (confirm("Caution:\nThis script will bring the selection to the front in reverse order\n\nPress YES to proceed.")){
	reverse(app.activeDocument.selection);
}
function reverse(array) {
	var l=array.length

	for (i=0;i<l;i++){
		array[i].zOrder(ZOrderMethod.BRINGTOFRONT);
	}
};


