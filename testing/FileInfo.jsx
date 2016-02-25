var doc = app.activeDocument

if (doc.selection.length < 1 ) {
	var ldesc = ""
	for (l = 0 ; l < doc.layers.length ; l ++ ) {
		var layer = doc.layers[l]
		var idesc = ""
		for ( i = 0 ; i < layer.pageItems.length ; i++ ) {
			item = layer.pageItems[i]
			idesc += item + "\n"
			var pdesc = ""
		
			for (var prop in item) {
				try { pdesc += item + "." +prop+ " = " + item[prop] + "\n" }
				catch (e){ pdesc += item + "." +prop+ ". = " + e + "\n"  }
			}
			alert( layer.name + item + "\n" + pdesc )
			
		}
		alert ( layer.name + "\n" + idesc )	
	}
} else {
	for ( i = 0 ; i < doc.selection.length ; i++ ) {
		item = doc.selection[i]
		idesc += item + "\n"
		var pdesc = ""
	
		for (var prop in item) {
			try { pdesc += item + "." +prop+ " = " + item[prop] + "\n" }
			catch (e){ pdesc += item + "." +prop+ " = " + e + "\n"  }
		}
		alert( item + "\n" + pdesc )
		
	}
		
}
