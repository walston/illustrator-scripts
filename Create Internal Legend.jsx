    doc = app.activeDocument,
    swatches = doc.swatches.getSelected(),
    textFillColor = new CMYKColor() ;
    	textFillColor.cyan		= 0 ;
		textFillColor.magenta	= 100 ;
    	textFillColor.yellow	= 0 ;
    	textFillColor.black		= 0 ;
    black = new GrayColor() ;
    	black.gray	= 100 ;
    var styleLegend = docRef.paragraphStyles.add("Legend")
    styleLegend.size = 12 ;
    styleLegend.characterAttributesleading = 21.6 ;
    styleLegend.paragraphAttributes.justification = Justification.LEFT ;
    styleLegend.characterAttributes.fillColor = textFillColor ;
    styleLegend.characterAttributes.textFont = app.textFonts.getByName("Arial-Black") ;

	//++++++++++++++++++++++++++++++++++++++++++++++++
	// BEGIN TASKS
	//++++++++++++++++++++++++++++++++++++++++++++++++
    createLegend(doc.views[0].centerPoint) ;
    
function createLegend( origin ) {
//++++++++++++++++++++++++++++++++++++++++++++++++
// create a text labels for all color swatches
//++++++++++++++++++++++++++++++++++++++++++++++++
	var theLegendGroup = doc.groupItems.add();
	theLegendGroup.name = "<Internal_TechPack_Legend>";
	theLegendGroup.move( doc, ElementPlacement.PLACEATBEGINNING );
	
	textRef = doc.textFrames.add()
    textRef.move( theLegendGroup, ElementPlacement.PLACEATEND ) ;
    textRef.left = origin[0] + 31;
    textRef.top  = origin[1] ; 
	//textRef.textRange.paragraphAttributes.tabStops[0] = { alignment: TabStopAlignment.Left , position: textRef.textRange.leading } ;
    
	//textRef.contents = prompt("Enter Placement Callout:", "Front" ) + ":";
	for(var i=0,len=swatches.length;i<len;i++) {
    	if (i<1) {
    		textRef.contents += cleanNames( swatches[i].name ) ;
    	} else {
	    	textRef.contents += "\n" + cleanNames( swatches[i].name ) ;
	    }
//		textRef.textRange.paragraphAttributes.tabStops[i].tabStopInfo.position = 18 ;
        	
		swatchBox = doc.pathItems.rectangle( 0 , 0 , textRef.textRange.size , textRef.textRange.size ) ;
		swatchBox.fillColor = swatches[i].color ;
		swatchBox.strokeColor = black ;
		swatchBox.left = origin[0] ;
		swatchBox.top =  origin[1] - (((i+1) * textRef.textRange.leading) - textRef.textRange.size )  ;
		swatchBox.move( theLegendGroup, ElementPlacement.PLACEATBEGINNING );	
	}
//	textRef = fixTabStopInfoTheHardWay(textRef) ;
//	centerMark = doc.pageItems.add().symbols.getByName("Center Guide");
//	centerMark.move ( theLegendGroup, ElementPlacement.PLACEATEND ) ;
//	theLegendGroup.move( theInfoLayer , ElementPlacement.PLACEATBEGINNING );
	theLegendGroup.selected = true ;

}

function cleanNames( str ) {
//++++++++++++++++++++++++++++++++++++++++++++++++
// Intended to clean up the names of SpotColors
//++++++++++++++++++++++++++++++++++++++++++++++++
	str = str.replace ( /^PANTONE /i , '' ) 
	str = str.replace ( /^Spot /i, '' ) 
	str = str.replace ( / C$/i , '' ) 
	str = str.replace ( /dk/i , 'Dark' ) 
	str = str.replace ( /lt/i , 'Light' ) 
	str = str.replace ( /underbase/i , 'Base' ) 
	str = str.replace ( /\w\S*/g ,
						function(txt){
							return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
						} )
	return str 
}

function fixTabStopInfoTheHardWay( textRef ) {

	// Get para attributes for all textRanges in paragraph
	tabRef  = textRef.textRange.paragraphAttributes.tabStops
	alert(tabRef.length)
	for ( t=0 ; t < tabRef.length ; t++ ) {
		textRef.tabRef[t].tabStopInfo.position = 2.0
	} // end for t
	
	return textRef
}