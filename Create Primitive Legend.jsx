
	//++++++++++++++++++++++++++++++++++++++++++++++++
	// Global variables
	//++++++++++++++++++++++++++++++++++++++++++++++++
    doc = app.activeDocument,
    swatches = doc.swatches.getSelected()
    textFillColor = new CMYKColor()
    	textFillColor.cyan		= 0
		textFillColor.magenta	= 100
    	textFillColor.yellow	= 0
    	textFillColor.black		= 0
    black = new GrayColor()
    	black.gray	= 100
    white = new GrayColor()
    	white.gray = 0
    swatchDimensions = new Array ( 45, 110 ) 

	//++++++++++++++++++++++++++++++++++++++++++++++++
	// BEGIN TASKS
	//++++++++++++++++++++++++++++++++++++++++++++++++
    createLegend(doc.views[0].centerPoint)
    
    
function createLegend( origin ) {
//++++++++++++++++++++++++++++++++++++++++++++++++
// create a text labels for all color swatches
//++++++++++++++++++++++++++++++++++++++++++++++++
	var theLegendGroup = doc.groupItems.add()
	theLegendGroup.name = "<Primative_TechPack_Legend>"
	theLegendGroup.move( doc, ElementPlacement.PLACEATBEGINNING )
	
	for(var i=0,len=swatches.length;i<len;i++) {
		//create group for each individual swatch
		var thisGroup = doc.groupItems.add()
    	thisGroup.name = cleanNames( swatches[i].name )
    	
    	//background rect
    	containerBox = doc.pathItems.rectangle(	0
    										,	0
    										,	swatchDimensions[0]
    										,	swatchDimensions[1] )									
		containerBox.fillColor = white
		containerBox.strokeColor = black
		containerBox.strokeWeight = 5
		containerBox.left = origin[0]
		containerBox.top =  origin[1]
		containerBox.move( thisGroup, ElementPlacement.PLACEATBEGINNING )
		
    	//swatch color rect
    	swatchBox = doc.pathItems.rectangle(	0
    										,	0
    										,	swatchDimensions[0]
    										,	swatchDimensions[1] * 0.65 )									
		swatchBox.fillColor = swatches[i].color
		swatchBox.strokeColor = black
		swatchBox.strokeWeight = 5 
		swatchBox.left = origin[0]
		swatchBox.top =  origin[1]
		swatchBox.move( thisGroup, ElementPlacement.PLACEATBEGINNING )
		
    	//text 
    	textRectRef =  doc.pathItems.rectangle(	0
    										,	0
    										,	swatchDimensions[0]
    										,	swatchDimensions[1] * 0.65 )									
    	textRef = doc.textFrames.areaText(textRectRef);
		textRef.left= origin[0]
		textRef.top = origin[1]
		textRef.contents = "\n\n" + cleanNames( swatches[i].name ) 	
		textRef.move( thisGroup, ElementPlacement.PLACEATBEGINNING )
		textRef.textRange.size = 12
		textRef.textRange.leading = 14.4
		textRef.textRange.justification = Justification.CENTER
		textRef.textRange.characterAttributes.fillColor = (is_dark(swatches[i].color)) ? white : black ;
		
		thisGroup.move( theLegendGroup , ElementPlacement.PLACEATEND )
		thisGroup.left = origin[0] + (swatchDimensions[0] * i)
		thisGroup.top = origin[1]
    	
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
	str = str.replace ( /^PANTONE /i , '' ) ;
	str = str.replace ( /^Spot /i, '' ) ;
	str = str.replace ( / C$/i , '' ) ;
	return str ;
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

function is_dark(color){
       if(color.typename)
        {
            switch(color.typename)
            {
                case "CMYKColor":
                    return (color.black>50 || (color.cyan>50 &&  color.magenta>50)) ? true : false;
                case "RGBColor":
                    return (color.red<100  && color.green<100 ) ? true : false;
                case "GrayColor":
                    return color.gray > 50 ? true : false;
                case "SpotColor":
                    return is_dark(color.spot.color);
                
                return false;
            }
        }
}