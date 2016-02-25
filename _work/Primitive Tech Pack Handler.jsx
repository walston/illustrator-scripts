
var doc = app.activeDocument
var pageWidth = 8.5 * 72 // ( inches * points )

main()

function main () {
	var originalWidth = doc.artboards[0].artboardRect[2] - doc.artboards[0].artboardRect[0];
	// alert(originalWidth/72);
	var spreadPages = Math.floor( originalWidth/( pageWidth ) );
	// alert(spreadPages);
	doc.artboards[0].artboardRect = [	doc.artboards[0].artboardRect[0]
									,	doc.artboards[0].artboardRect[1]
									,	doc.artboards[0].artboardRect[0] + pageWidth
									,	doc.artboards[0].artboardRect[3] ] ;
	
	for ( i=1 ; i < spreadPages ; i++ ) {
		var thisArtboardRect = doc.artboards[0].artboardRect
		thisArtboardRect[0] = ( i*pageWidth )
		thisArtboardRect[2] = ( (i+1)*pageWidth )
		doc.artboards.insert( thisArtboardRect , i )
		
	}
	
}