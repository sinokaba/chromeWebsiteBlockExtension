var injected = false;
if(!injected){
  	chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  		if(message.act == "showBlockPage"){
  		document.body.className = "b";
  		document.body.removeAttribute("id");
 		document.body.innerHTML= "<div id='text'><h1 style='color:white;text-shadow: 3px 3px 0px rgba(0, 0, 0, 1);'>" + message.websiteUrl + " has been blocked.</h1><h2 style='color:white;text-shadow: 3px 3px 0px rgba(0, 0, 0, 1);' > Why it was blocked: " + message.reason + "</h2></div>";
 		}
 	})
	injected = true;
}