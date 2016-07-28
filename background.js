var callback = function(details){
		alert("Cancelling: " + details.url + ". Get back to work!");
	  	return {cancel: true};
}

function enableBlocking(site){
	chrome.webRequest.onBeforeRequest.addListener(callback,
	{urls: ["*://www." + site + "/*"]},
	["blocking"]);
}
function disableBlocking(){
	chrome.webRequest.onBeforeRequest.removeListener(callback);	
}


