chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  	if(message.act == "showBlockPage"){	
		var link = document.createElement("link");
		link.href = chrome.extension.getURL("inject.css");
		link.type = "text/css";
		link.rel = "stylesheet";
		document.getElementsByTagName("head")[0].appendChild(link);
	  	document.body.className = "b";
	 	document.body.innerHTML = "<div id='text'><h1 style='font-size: 36px !important;top: 50%;color:white;text-shadow: 3px 3px 0px rgba(0, 0, 0, 1);'>" 
	 	+ message.websiteUrl + " has been blocked.</h1><h2 style='font-size: 26px !important;padding-top: 30px;color:white;text-shadow: 3px 3px 0px rgba(0, 0, 0, 1);' > Why it was blocked: " 
	 	+ message.reason + "</h2></div>";
	 	window.stop();
	 				
 	}
})
