/////////////////////////////////////////////////////////////////
// Construct Color Sep
//————————————————————————————————————————————————
//
//  This script will:
//	• Move artwork to the top center of the artboard
//	• Resizes crop marks to surround the artwork
//		no horizontal padding, 0.125" vertical padding provided
//	• Resize the artboard to the same dimensions of cropmarks
//	• Generate a legend of text fields colored with all SpotColor swatches
//		special recognition is given to the term BASE
//
//————————————————————————————————————————————————
// Inspiration for this code was reverse engineered from
// RENDER SWATCH LEGEND by John Wundes
// JS code (c) copyright: John Wundes ( john@wundes.com ) www.wundes.com
// copyright full text here:  http://www.wundes.com/js4ai/copyright.txt
//
//////////////////////////////////////////////////////////////////  
// http://jongware.mit.edu/iljscs6html/iljscs6/pe_ColorModel.html
// color model class could be implemented instead of "color.typename"
// this could prevent global process colors from being incorrectly presumed
// to be spot
//  
    doc = app.activeDocument,
    swatches = doc.swatches,
    board = doc.artboards[doc.artboards.getActiveArtboardIndex()] ;
    app.coordinateSystem = CoordinateSystem.DOCUMENTCOORDINATESYSTEM ;
    rows = 4;
    colwidth = 54 ; //in points
    horizontalPadding = 36 ;
    verticalPadding = 54 ;
    theArtworkLayer = tryToGetLayer('ARTWORK') ;
    theInfoLayer = tryToGetLayer('ART INFO') ;
    theArtwork = null ;
    	
    
	//++++++++++++++++++++++++++++++++++++++++++++++++
	// BEGIN TASKS
	//++++++++++++++++++++++++++++++++++++++++++++++++
	activeDocument.layers[0].locked= false;
	moveArtwork() 		;
	resizeCropMarks()	;
	//resizeArtBoard()	;
	createLegend()		;


function moveArtwork( ) {
//++++++++++++++++++++++++++++++++++++++++++++++++
// Group and Move the items of the Artwork layer
//++++++++++++++++++++++++++++++++++++++++++++++++
	var theArtworkGroup = theArtworkLayer.groupItems.add();
	theArtworkGroup.name = "<Artwork>" ;
    
    // make sure there's not only 1 group on the layer
    if (theArtworkLayer.pageItems.length < 2 && theArtworkLayer.pageItems[1].typeName == 'GroupItem') { //this isn't quite working right
        //alert('skipped the grouping, it\'s already grouped', 'return');
    }
    else {
		// paginate through all the items on the targeted layer
		for ( i = theArtworkLayer.pageItems.length - 1; i > 0 ; i-- ) {
			// add said item to theGroup item
			theArtworkLayer.pageItems[i].move( theArtworkGroup, ElementPlacement.PLACEATEND ) ;
		}
    }
        
    // move bounding box to origin according to center top.
    theArtworkGroup.left = getCoordinates("ARTWORK")[0] - theArtworkGroup.width/2 
    theArtworkGroup.top  = getCoordinates("ARTWORK")[1] ;
    
    theArtwork = theArtworkGroup ;
    
}

function createLegend( ) {
//++++++++++++++++++++++++++++++++++++++++++++++++
// create a text labels for all color swatches
//++++++++++++++++++++++++++++++++++++++++++++++++
	var theLegendGroup = doc.groupItems.add();
	theLegendGroup.name = "<Print_Colors>";
	theLegendGroup.move( doc, ElementPlacement.PLACEATBEGINNING );
	origin = getCoordinates("COLORLEGEND") ;

	c = 0.00;
	
	for(var i=0,len=swatches.length;i<len;i++) {
    	if (swatches[i].color.typename == "SpotColor" &&
    		swatches[i].name !== "[Registration]" &&
    		swatches[i].name !== "BASE" ) {
    	
        	textRef = doc.textFrames.add();
        	textRef.contents = cleanNames( swatches[i].name ) ;
        	textRef.textRange.size = 6 ;
        	textRef.textRange.leading = 6 ;
        	textRef.textRange.justification = Justification.RIGHT ;
        	textRef.textRange.textFont = app.textFonts.getByName("Arial-Black") ;
        	textRef.textRange.characterAttributes.fillColor = swatches[i].color ;
        	textRef.left = origin[0] + ((-colwidth * (Math.floor(c/rows)))-textRef.width-38) ;
        	textRef.top =  origin[1] - ( (c%rows) * 6 ) ;
        	textRef.move( theLegendGroup, ElementPlacement.PLACEATEND ) ;
        	
       		c++;
        } else if ( swatches[i].name == "BASE" ) {
        
        	textRef = doc.textFrames.add();
        	textRef.contents = cleanNames( swatches[i].name ) ;
        	textRef.textRange.size = 6 ;
        	textRef.textRange.leading = 6 ;
        	textRef.textRange.justification = Justification.LEFT ;
        	textRef.textRange.textFont = app.textFonts.getByName("Arial-Black") ;
        	textRef.textRange.characterAttributes.fillColor = swatches[i].color ;
        	textRef.left =  origin[0] + 38 ;
        	textRef.top  =  origin[1] + 0  ;
        	textRef.move( theLegendGroup, ElementPlacement.PLACEATEND ) ;
        }
        	
	}
//	centerMark = doc.pageItems.add().symbols.getByName("Center Guide");
//	centerMark.move ( theLegendGroup, ElementPlacement.PLACEATEND ) ;
	theLegendGroup.move( theInfoLayer , ElementPlacement.PLACEATBEGINNING );
}

function resizeArtBoard ( ) {
//++++++++++++++++++++++++++++++++++++++++++++++++
// adjust the artboard to wrap the artwork
//++++++++++++++++++++++++++++++++++++++++++++++++

        // boundingArray as Array
    //alert ( boundingArray , 'return' );
/*    
    var activeABindex = doc.artboards.getActiveArtboardIndex();  
    var newAB = doc.artboards[activeABindex];  
    
    var ableft = theArtwork.left - 36;  
    var abtop = theArtwork.top - 54;  
    var abright = (theArtwork.left  - theArtwork.)+36;  
    var abbottom = boundingArray[3] + 54;  
                                    
    newAB.artboardRect = [ableft, abtop, abright, abbottom];  
                                    
    var myZoom = doc.activeView.zoom;  
    doc.activeView.zoom = myZoom+.01;  
    doc.activeView.zoom = myZoom;
    
    return Array( ableft, abtop, abright, abbottom );
*/    
    }
    
function resizeCropMarks () {
//++++++++++++++++++++++++++++++++++++++++++++++++
// resizes and repositions the cropmarks
//++++++++++++++++++++++++++++++++++++++++++++++++

    theCropMarks = theInfoLayer.symbolItems.getByName("Reg Marks 3") ;
    theCropMarks.width = theArtwork.width + ( horizontalPadding * 2 ) ;
    theCropMarks.height = theArtwork.height + ( verticalPadding * 2 ) ;
    theCropMarks.top = theArtwork.top - verticalPadding ;
    theCropMarks.left = theArtwork.left - horizontalPadding; 
    
}

function symbolExists( seekInDoc, seekSymbol ) {
//++++++++++++++++++++++++++++++++++++++++++++++++
// iterate through symbols looking for seekSymbol
//++++++++++++++++++++++++++++++++++++++++++++++++
	var symbolExists = false ;
    for (var j=0; j < seekInDoc.symbols.length; j++) {  
        if (seekInDoc.symbols[j].name == seekSymbol) {  
            return true;  
        }  
    }
}

function getCoordinates( placement ) {
//++++++++++++++++++++++++++++++++++++++++++++++++
// defines coordinates for specified "PLACEMENT"s
//++++++++++++++++++++++++++++++++++++++++++++++++
	var coords = new Array();
		coords[0] = 0 ;
		coords[1] = 0 ;
	
/*	alert(	"Current Artboard dimensions -- \n"  + 
			"left: "  + board.artboardRect[0] + "\n" + 
			"top: "   + board.artboardRect[1] + "\n" +
			"right: " + board.artboardRect[2] + "\n" +
			"bottom: "+ board.artboardRect[3]			) ;
*/
	// keywords are stylized in ALLCAPS with NOWHITESPACE
	switch (placement) {
		case "COLORLEGEND":
			coords[0] = (board.artboardRect[0] + board.artboardRect[2]) / 2 ;
			coords[1] = board.artboardRect[3]  + 26 ;
			break;
		case "ARTWORK":
			coords[0] = (board.artboardRect[0] + board.artboardRect[2]) / 2 ;
			coords[1] = board.artboardRect[1] - 54 ; //in points
			break;
		default:
			coords = [0,0] ;
			break;
	}
	return coords ;
}

function cleanNames( str ) {
//++++++++++++++++++++++++++++++++++++++++++++++++
// Intended to clean up the names of SpotColors
//++++++++++++++++++++++++++++++++++++++++++++++++
	str = str.replace ( /PANTONE /i , '' ) ;
	str = str.replace ( /Spot /i, '' ) ;
	str = str.replace ( / C/i , '' ) ;
	return str ;
}

function tryToGetLayer( layerName ) {
	try {
		return doc.layers.getByName(layerName) ;
	} catch (e) {
		try {
			return doc.layers[0] ;
		} catch (ee) { 
			alert("script failure: \n" + ee + "\n" + e );
		}
	}
}

/*
//
//
//
//testing the console
console.log('hello world') ;
console.print() ;

function console () {
	value = "" ;
	function console.log (str) {
		this.value = this.value + "\n" + str ;
	};
	function console.print() {
		var output = doc.textFrames.add() ;
		output.contents = this.value ;
	};
}*/