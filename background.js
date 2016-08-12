var n = -1;

var permanentlyBlock = function(details){
	alert("Cancelling: " + details.url + ". Get back to work!");
	console.log(details.timeStamp);
	return {cancel: true};
}
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
var callback8 = function(details){
	alert("Cancelling: " + details.url + ". Get back to work!");
	console.log(details.timeStamp);
	return {cancel: true};
}
var callback9 = function(details){
	alert("Cancelling: " + details.url + ". Get back to work!");
	console.log(details.timeStamp);
	return {cancel: true};
}
var callback10 = function(details){
	alert("Cancelling: " + details.url + ". Get back to work!");
	console.log(details.timeStamp);
	return {cancel: true};
}

var blockAllCallback = function(details){
	alert("Cancelling: " + details.url + ". Get back to work!");
	console.log(details.timeStamp);
	return {cancel: true};
}

function enableBlocking(site, n){
	if(n == 0){
		chrome.webRequest.onBeforeRequest.addListener(callback1,
		{urls: ["*://" + site + "/*", "*://www." + site + "/*"]},
		["blocking"]);

	}
	else if(n == 1){
		chrome.webRequest.onBeforeRequest.addListener(callback2,
		{urls: ["*://" + site + "/*", "*://www." + site + "/*"]},
		["blocking"]);	
	}
	else if(n == 2){
		chrome.webRequest.onBeforeRequest.addListener(callback3,
		{urls: ["*://" + site + "/*", "*://www." + site + "/*"]},
		["blocking"]);
	}
	else if(n == 3){
		chrome.webRequest.onBeforeRequest.addListener(callback4,
		{urls: ["*://" + site + "/*", "*://www." + site + "/*"]},
		["blocking"]);		
	}
	else if(n == 4){
		chrome.webRequest.onBeforeRequest.addListener(callback5,
		{urls: ["*://" + site + "/*", "*://www." + site + "/*"]},
		["blocking"]);		
	}
	else if(n == 5){
		chrome.webRequest.onBeforeRequest.addListener(callback6,
		{urls: ["*://" + site + "/*", "*://www." + site + "/*"]},
		["blocking"]);
	}
	else if(n == 6){
		chrome.webRequest.onBeforeRequest.addListener(callback7,
		{urls: ["*://" + site + "/*", "*://www." + site + "/*"]},
		["blocking"]);			
	}
	else if(n == 7){
		chrome.webRequest.onBeforeRequest.addListener(callback8,
		{urls: ["*://" + site + "/*", "*://www." + site + "/*"]},
		["blocking"]);		
	}
	else if(n == 8){
		chrome.webRequest.onBeforeRequest.addListener(callback9,
		{urls: ["*://" + site + "/*", "*://www." + site + "/*"]},
		["blocking"]);
	}
	else if(n == 9){
		chrome.webRequest.onBeforeRequest.addListener(callback10,
		{urls: ["*://" + site + "/*", "*://www." + site + "/*"]},
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
	else if(n == 7){
		chrome.webRequest.onBeforeRequest.removeListener(callback8);
	}
	else if(n == 8){
		chrome.webRequest.onBeforeRequest.removeListener(callback9);	
	}
	else if(n == 9){
		chrome.webRequest.onBeforeRequest.removeListener(callback10);
	}
}

function unblockAll(){
	chrome.webRequest.onBeforeRequest.removeListener(callback1);
	chrome.webRequest.onBeforeRequest.removeListener(callback2);
	chrome.webRequest.onBeforeRequest.removeListener(callback3);
	chrome.webRequest.onBeforeRequest.removeListener(callback4);	
	chrome.webRequest.onBeforeRequest.removeListener(callback5);
	chrome.webRequest.onBeforeRequest.removeListener(callback6);	
	chrome.webRequest.onBeforeRequest.removeListener(callback7);
	chrome.webRequest.onBeforeRequest.removeListener(callback8);
	chrome.webRequest.onBeforeRequest.removeListener(callback9);	
	chrome.webRequest.onBeforeRequest.removeListener(callback10);
	chrome.webRequest.onBeforeRequest.removeListener(blockAllCallback);
}
function addedCounter(act){
	if(act == "blocking"){
		n++;
	}
	else if(act == "unblocking"){
		n--;
	}
	return n;
}

function permablock(site){
	chrome.webRequest.onBeforeRequest.addListener(permanentlyBlock,
	{urls: ["*://" + site + "/*", "*://www." + site + "/*"]},
	["blocking"]);
}

function blockAllWebsites(){
	chrome.webRequest.onBeforeRequest.addListener(blockAllCallback, 
	{urls: ["http://*/*", "https://*/*"]},
	["blocking"]);
}