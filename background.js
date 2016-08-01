var n = 0;
var x = 0;
var callback1 = function(details){
	alert("Cancelling: " + details.url + ". Get back to work!");
	console.log(details.timeStamp);
	return {cancel: true};
}
var callback2 = function(details){
	alert("Cancelling: " + details.url + ". Get back to work!");
	console.log(details.timeStamp);
	return {cancel: true};
}
var callback3 = function(details){
	alert("Cancelling: " + details.url + ". Get back to work!");
	console.log(details.timeStamp);
	return {cancel: true};
}
var callback4 = function(details){
	alert("Cancelling: " + details.url + ". Get back to work!");
	console.log(details.timeStamp);
	return {cancel: true};
}
var callback5 = function(details){
	alert("Cancelling: " + details.url + ". Get back to work!");
	console.log(details.timeStamp);
	return {cancel: true};
}
var callback6 = function(details){
	alert("Cancelling: " + details.url + ". Get back to work!");
	console.log(details.timeStamp);
	return {cancel: true};
}
var callback7 = function(details){
	alert("Cancelling: " + details.url + ". Get back to work!");
	console.log(details.timeStamp);
	return {cancel: true};
}

function enableBlocking(site, n){
	if(n == 0){
		chrome.webRequest.onBeforeRequest.addListener(callback1,
		{urls: ["*://www." + site + "/*"]},
		["blocking"]);
	}
	else if(n == 1){
		chrome.webRequest.onBeforeRequest.addListener(callback2,
		{urls: ["*://www." + site + "/*"]},
		["blocking"]);		
	}
	else if(n == 2){
		chrome.webRequest.onBeforeRequest.addListener(callback3,
		{urls: ["*://www." + site + "/*"]},
		["blocking"]);			
	}
	else if(n == 3){
		chrome.webRequest.onBeforeRequest.addListener(callback4,
		{urls: ["*://www." + site + "/*"]},
		["blocking"]);		
	}
	else if(n == 4){
		chrome.webRequest.onBeforeRequest.addListener(callback5,
		{urls: ["*://www." + site + "/*"]},
		["blocking"]);			
	}
	else if(n == 5){
		chrome.webRequest.onBeforeRequest.addListener(callback6,
		{urls: ["*://www." + site + "/*"]},
		["blocking"]);		
	}
	else if(n == 6){
		chrome.webRequest.onBeforeRequest.addListener(callback7,
		{urls: ["*://www." + site + "/*"]},
		["blocking"]);			
	}
}

function disableBlocking(n){
	if(n == 0){
		chrome.webRequest.onBeforeRequest.removeListener(callback1);
	}
	else if(n == 1){
		chrome.webRequest.onBeforeRequest.removeListener(callback2);
	}
	else if(n == 2){
		chrome.webRequest.onBeforeRequest.removeListener(callback3);
	}
	else if(n == 3){
		chrome.webRequest.onBeforeRequest.removeListener(callback4);	
	}
	else if(n == 4){
		chrome.webRequest.onBeforeRequest.removeListener(callback5);
	}
	else if(n == 5){
		chrome.webRequest.onBeforeRequest.removeListener(callback6);	
	}
	else if(n == 6){
		chrome.webRequest.onBeforeRequest.removeListener(callback7);
	}
}

function unblockAll(z){
	n = 0;
	for(i = 1; i < z; i++){
		chrome.webRequest.onBeforeRequest.removeListener(callback + i);
	}
}
function addedCounter(){
	return n++;
}
function removedCounter(){
	return x++;
}
