/* set up for testing   
	doc = app.activeDocument;  
	ele = {position:[100,0], size:[300,100], tab:[60,90,120,200]};  
	var rectRef = doc.pathItems.rectangle(ele.position[0]/1, ele.position[1]/1, ele.size[0]/1, ele.size[1]/1);  
	eleText = doc.textFrames.areaText(rectRef);
	eleText.contents="hello\tworld\thow\tare\tyou\ttoday";  
  
/* Use the following to set tab stops 
	t = new Array(ele.tab.length);  
	for (i=0; tab<ele.tab.length; i++){  
		t[i] = new TabStopInfo;  
		t[i].position = ele.tab[i];  
		}  
	eleText.paragraphs[0].tabStops = t;  
	*/
	
///////////////////

// for a single TabStop with decimal alignment  
var myDoc = app.activeDocument;  
var myDocName = myDoc.name;  
  
var t = new Array();  
t[0] = new TabStopInfo;  
with (t[0]) {  
    position = 120;              // in pt
    alignment = TabStopAlignment.Left;  
    }
var aText = myDoc.textFrames.add();  
with (aText) {  
    contents = myDocName + "\t120.00 Decimalpoint-TabStop\n\tTabStop 2";  
    left = 0;  
    top = 0;  
    for(i=0 ; i<paragraphs.length ; i++ ) {
    	paragraphs[i].tabStops = t;  
    	}
    }  