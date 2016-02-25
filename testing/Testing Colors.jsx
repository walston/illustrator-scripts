var doc = app.activeDocument
var sel = doc.selection
var colors = new Array()
var txt = ""

// for (i = 0 ; i < doc.selection.length ; i++ ) {
// // 	txt+="sel["+i+"]\n"
// 	obj = doc.selection[i]
// 	colors.push(obj.fillColor)
// 	alert(colors[colors.length-1])
// 	colors.push(obj.strokeColor)
// }
// 
// for ( i = 0 ; i < colors.length ; i++ ) {
// 	txt+= "\t"+colorValue(colors[i])+"\n"
// 	}
// alert("Colors {\n"+txt +"}")
colors.push(sel[0].fillColor)
alert( sel[0].fillColor == colors[0] )

function colorValue(color){
       if(color.typename)
        {
            switch(color.typename)
            {
                case "CMYKColor":
                    return "CMYK("+color.cyan+","+color.magenta+","+color.yellow+","+color.black+")"
                case "RGBColor":
                    return "RGB("+color.red+","+color.green+","+color.blue+")"
                case "GrayColor":
                    return "GRAY("+color.gray+"%)"
                case "SpotColor":
                    return "Spot-"+colorValue(color.spot.color);
                
                return "invalid";
            }
        }
}