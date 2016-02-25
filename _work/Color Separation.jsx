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

    doc = app.activeDocument
    docswatches = doc.swatches
    board = doc.artboards[doc.artboards.getActiveArtboardIndex()]
    app.coordinateSystem = CoordinateSystem.DOCUMENTCOORDINATESYSTEM
    theArtworkLayer = tryToGetLayer('ARTWORK')
    theInfoLayer = tryToGetLayer('ART INFO')
    theArtwork = null

    // Prompt the user with a custom dialog
    initialPrompt();

	// CREATED A CUSTOM DIALOG
	function initialPrompt () {
		// define window
		var w = new Window('dialog', 'Example', undefined, undefined);
			w.jobNameTextGroup = w.add('group');
				w.jobNameTextGroup.alignment = 'left';
				w.jobNameTextGroup.jobNameTextLabel = w.jobNameTextGroup.add('statictext', undefined, 'File Name');
				w.jobNameTextGroup.jobNameEditText = w.jobNameTextGroup.add('edittext', undefined, '');
				w.jobNameTextGroup.jobNameEditText.characters = 18;
				w.jobNameTextGroup.jobNameEditText.active = true;
			w.placementGroup = w.add('group');
				w.placementGroup.alignment = 'left';
				w.placementGroup.placementTextLabel = w.placementGroup.add('statictext', undefined, 'Placement');
				w.placementGroup.placementDropdown = w.placementGroup.add('dropdownlist', undefined,
					// Placements selectable from a dropdown
					['Front', 'Back', 'Right Sleeve', 'Left Sleeve', 'Left Chest', 'Center Chest', 'Yoke', 'Hip', 'Other']);
				w.placementGroup.placementDropdown.selection = 0;
			w.buttonGroup = w.add('group');
				w.buttonGroup.alignment = 'right';
				w.buttonGroup.okButton = w.buttonGroup.add('button', undefined, 'OK', {name:'ok'});
				w.buttonGroup.cancelButton = w.buttonGroup.add('button', undefined, 'Cancel', {name:'cancel'});

		if (w.show() === 1) {    	
    
			//++++++++++++++++++++++++++++++++++++++++++++++++
			// BEGIN TASKS
			//++++++++++++++++++++++++++++++++++++++++++++++++
			activeDocument.layers[0].locked= false;
			moveArtwork() 		; // centers the artwork on board
		 	resizeCropMarks()	; // arranges the cropmarks around the art
		 	resizeArtBoard()	; // resizes the artboard around the cropmarks
			createLegend()		; // creates a color legend (based on swatches, not colors in art)
			updateInfo( [w.jobNameTextGroup.jobNameEditText.text,
					w.placementGroup.placementDropdown.selection.text].join(' '))		; // updates the file info in top right corner
			return null;
		}
	}
    
function updateInfo(userInput) {
	fileInfo = doc.textFrames.getByName("fileInfo");

	userInput = userInput.replace ( /\w\S*/g ,
						function(txt){
							return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
						});
	fileInfo.contents = userInput + " SEP" + "\n"
			+ (Math.round(theArtwork.width /0.72)/100) + "\" × "
			+ (Math.round(theArtwork.height /0.72)/100) + "\""
	var fileName = userInput.split(/\s/)
	fileName.push("sep.ai");
}

function moveArtwork( ) {
	//++++++++++++++++++++++++++++++++++++++++++++++++
	// Group and Move the items of the Artwork layer
	//++++++++++++++++++++++++++++++++++++++++++++++++
	var theArt = new Array()
	var theArtworkGroup
	
	// if there's only 1 group item item, don't worry about it
	if (( theArtworkLayer.pageItems.length > 1)
		||((theArtworkLayer.pageItems.length = 1)
		&&( theArtworkLayer.groupItems.length != 1 ))) {
	
		// establish an array BEFORE creating the Artwork groupItem
		for (i = 0 ; i < theArtworkLayer.pageItems.length ; i++ ) {
			theArt[i] = theArtworkLayer.pageItems[i] 
		}
	
		theArtworkGroup = theArtworkLayer.groupItems.add()
		theArtworkGroup.name = "<Artwork>"
	
		for( i = 0 ; i < theArt.length ; i++ ) {
			item = theArt[i]
			item.move ( theArtworkGroup , ElementPlacement.PLACEATEND )
		}		
		// move bounding box to origin according to center top.
		theArtworkGroup.left = getCoordinates("ARTWORK")[0] - theArtworkGroup.width/2 
		theArtworkGroup.top  = getCoordinates("ARTWORK")[1]
		
	} else if ( theArtworkLayer.pageItems.length = 1 &&
				theArtworkLayer.groupItems.length = 1 ) {
				
		theArtworkGroup = theArtworkLayer.pageItems[0]
		theArtworkGroup.name = "<Artwork>"
		
		// move bounding box to origin according to center top.
		theArtworkGroup.left = getCoordinates("ARTWORK")[0] - theArtworkGroup.width/2 
		theArtworkGroup.top  = getCoordinates("ARTWORK")[1]
				
	}
    theArtwork = theArtworkGroup
}

function resizeCropMarks ( ) {
	//++++++++++++++++++++++++++++++++++++++++++++++++
	// resizes and repositions the cropmarks
	//++++++++++++++++++++++++++++++++++++++++++++++++
	//	DEFAULTS
	    horizontalPadding = 36;
	    verticalPadding = 54;

    theCropMarks = theInfoLayer.symbolItems.getByName("Reg Marks");
    theCropMarks.width = theArtwork.width + ( horizontalPadding * 2 );
    // We don't want the corp marks being bigger that 16.75in so resize them accordingly.
    theCropMarks.width > 16.75*72 ? theCropMarks.width = 16.75*72 : null;
    theCropMarks.height = theArtwork.height + ( verticalPadding * 2 )
    theCropMarks.top = theArtwork.top + verticalPadding;
    theCropMarks.left = (theArtwork.left+(theArtwork.width/2)) - (theCropMarks.width/2);
    theCenterGuide = theInfoLayer.symbolItems.getByName("Center Guide");
    theCenterGuide.top = (theCropMarks.top - theCropMarks.height) + (theCenterGuide.height + 18);
}

function resizeArtBoard ( ) {
	//++++++++++++++++++++++++++++++++++++++++++++++++
	// adjust the artboard to wrap the artwork
	//++++++++++++++++++++++++++++++++++++++++++++++++

	var theCropMarks = theInfoLayer.symbolItems.getByName("Reg Marks");
	board.artboardRect = theCropMarks.geometricBounds;
 }

function createLegend( ) {
	//++++++++++++++++++++++++++++++++++++++++++++++++
	// create a text label for each color swatches
	//++++++++++++++++++++++++++++++++++++++++++++++++
	// DEFAULTS
    rows = 4
    colwidth = 54 //in points

	//clear out the old
	try{ doc.groupItems.getByName("<Print_Colors>").remove() }
	catch(e){}
	
	// search for swatches in the artwork
	for (i =0 ; i < 1 ; i++) {
	
	}
	
	var theLegendGroup = doc.groupItems.add();
	theLegendGroup.name = "<Print_Colors>";
	theLegendGroup.move( doc, ElementPlacement.PLACEATBEGINNING );
	origin = getCoordinates("COLORLEGEND") ;

	c = 0.00;
	
	for(var i=0,len=docswatches.length;i<len;i++) {
    	if (docswatches[i].color.typename == "SpotColor" &&
    		docswatches[i].name !== "[Registration]" &&
    		docswatches[i].name !== "BASE" ) {
    	
        	textRef = doc.textFrames.add();
        	textRef.contents = cleanNames( docswatches[i].name ) ;
        	textRef.textRange.size = 6 ;
        	textRef.textRange.leading = 6 ;
        	textRef.textRange.justification = Justification.RIGHT ;
        	textRef.textRange.textFont = app.textFonts.getByName("Arial-Black") ;
        	textRef.textRange.characterAttributes.fillColor = docswatches[i].color ;
        	textRef.left = origin[0] + ((-colwidth * (Math.floor(c/rows)))-textRef.width-38) ;
        	textRef.top =  origin[1] - ( (c%rows) * 6 ) ;
        	textRef.move( theLegendGroup, ElementPlacement.PLACEATEND ) ;
        	
       		c++;
        } else if ( docswatches[i].name == "BASE" ) {
        
        	textRef = doc.textFrames.add();
        	textRef.contents = cleanNames( docswatches[i].name ) ;
        	textRef.textRange.size = 6 ;
        	textRef.textRange.leading = 6 ;
        	textRef.textRange.justification = Justification.LEFT ;
        	textRef.textRange.textFont = app.textFonts.getByName("Arial-Black") ;
        	textRef.textRange.characterAttributes.fillColor = docswatches[i].color ;
        	textRef.left =  origin[0] + 38 ;
        	textRef.top  =  origin[1] + 0  ;
        	textRef.move( theLegendGroup , ElementPlacement.PLACEATEND ) ;
        }
        	
	}
	theLegendGroup.move( theInfoLayer , ElementPlacement.PLACEATBEGINNING );
}  

function getCoordinates( placement ) {
	//++++++++++++++++++++++++++++++++++++++++++++++++
	// defines coordinates for specified "PLACEMENT"s
	//++++++++++++++++++++++++++++++++++++++++++++++++
	var coords = new Array();
		coords[0] = 0 ;
		coords[1] = 0 ;
	
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

