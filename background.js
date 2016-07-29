var n = 0;
var x = 0;
var callback = function(details){
	alert("Cancelling: " + details.url + ". Get back to work!");
	console.log(details.timeStamp);
	return {cancel: true};
}
var callback2 = function(details){
	alert("Cancelling: " + details.url + ". Get back to work!");
	console.log(details.timeStamp);
	return {cancel: true};
}
function enableBlocking(site, n){
	if(n == 0){
		chrome.webRequest.onBeforeRequest.addListener(callback,
		{urls: ["*://www." + site + "/*"]},
		["blocking"]);
	}
	else if(n == 1){
		chrome.webRequest.onBeforeRequest.addListener(callback2,
		{urls: ["*://www." + site + "/*"]},
		["blocking"]);		
	}
}

function disableBlocking(n){
	if(n == 0){
		chrome.webRequest.onBeforeRequest.removeListener(callback,
		{urls: ["*://www.reddit.com/*"]},
		["blocking"]);	
	}
	else if(n == 1){
		chrome.webRequest.onBeforeRequest.removeListener(callback2,
		{urls: ["*://www.reddit.com/*"]},
		["blocking"]);	
	}
}

function addedCounter(){
	return n++;
}
function removedCounter(){
	return x++;
}
