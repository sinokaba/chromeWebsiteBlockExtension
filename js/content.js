chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	window.stop();
  	if(message.act == "showBlockPage"){	
		var link = document.createElement("link");
		link.href = chrome.extension.getURL("inject.css");
		link.type = "text/css";
		link.rel = "stylesheet";
		document.getElementsByTagName("head")[0].appendChild(link);
  		while(document.body.attributes.length > 0){
    		document.body.removeAttribute(document.body.attributes[0].name);
    	}
	  	document.body.className = "b";
	 	document.body.innerHTML = "<div id='text'><h1 style='color:white;text-shadow: 3px 3px 0px rgba(0, 0, 0, 1);'>" 
	 	+ message.websiteUrl + " has been blocked.</h1><h2 style='color:white;text-shadow: 3px 3px 0px rgba(0, 0, 0, 1);' > Why it was blocked: " 
	 	+ message.reason + "</h2></div>";	 					
 	}
})
