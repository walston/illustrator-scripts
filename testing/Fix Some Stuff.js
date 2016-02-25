// var doc = app.activeDocument
// for (i = 0 ; i < doc.symbolItems.length ; i ++ ) {
// 	var symbol = doc.symbolItems[i]
// 	
// 	symbol.name = symbol.symbol.name
// 	alert (symbol.name)
// }
// 
// 
var it = app.activeDocument.selection[0]

it.name = prompt("What name should "+it+" have?")
alert(it.name)