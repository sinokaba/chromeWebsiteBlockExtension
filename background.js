var n = -1;

var permanentlyBlock = function(details){
	console.log(details.timeStamp);
	return {redirectUrl: 'https://sinokaba.github.io/redirect/'};
}
var callback0 = function(details){
	console.log(details.timeStamp);
	return {redirectUrl: 'https://sinokaba.github.io/redirect/'};
}
var callback1 = function(details){
	console.log(details.timeStamp);
	return {redirectUrl: 'https://sinokaba.github.io/redirect/'};
}
var callback2 = function(details){
	console.log(details.timeStamp);
	return {redirectUrl: 'https://sinokaba.github.io/redirect/'};
}
var callback3 = function(details){
	console.log(details.timeStamp);
	return {redirectUrl: 'https://sinokaba.github.io/redirect/'};
}
var callback4 = function(details){
	console.log(details.timeStamp);
	return {redirectUrl: 'https://sinokaba.github.io/redirect/'};
}
var callback5 = function(details){
	console.log(details.timeStamp);
	return {redirectUrl: 'https://sinokaba.github.io/redirect/'};
}
var callback6 = function(details){
	console.log(details.timeStamp);
	return {redirectUrl: 'https://sinokaba.github.io/redirect/'};
}
var callback7 = function(details){
	console.log(details.timeStamp);
	return {redirectUrl: 'https://sinokaba.github.io/redirect/'};
}

var blockAllCallback = function(details){
	console.log(details.timeStamp);
	return {redirectUrl: 'https://sinokaba.github.io/redirect/'};
}

function enableBlocking(site, x){
	if(x == 0){
		chrome.webRequest.onBeforeRequest.addListener(callback0,
		{urls: ["*://" + site + "/*", "*://www." + site + "/*"]},
		["blocking"]);
	}
	else if(x == 1){
		chrome.webRequest.onBeforeRequest.addListener(callback1,
		{urls: ["*://" + site + "/*", "*://www." + site + "/*"]},
		["blocking"]);
	}
	else if(x == 2){
		chrome.webRequest.onBeforeRequest.addListener(callback2,
		{urls: ["*://" + site + "/*", "*://www." + site + "/*"]},
		["blocking"]);
	}
	else if(x == 3){
		chrome.webRequest.onBeforeRequest.addListener(callback3,
		{urls: ["*://" + site + "/*", "*://www." + site + "/*"]},
		["blocking"]);	
	}
	else if(x == 4){
		chrome.webRequest.onBeforeRequest.addListener(callback4,
		{urls: ["*://" + site + "/*", "*://www." + site + "/*"]},
		["blocking"]);	
	}
	else if(x == 5){
		chrome.webRequest.onBeforeRequest.addListener(callback5,
		{urls: ["*://" + site + "/*", "*://www." + site + "/*"]},
		["blocking"]);
	}
	else if(x == 6){
		chrome.webRequest.onBeforeRequest.addListener(callback6,
		{urls: ["*://" + site + "/*", "*://www." + site + "/*"]},
		["blocking"]);	
	}
	else if(x == 7){
		chrome.webRequest.onBeforeRequest.addListener(callback7,
		{urls: ["*://" + site + "/*", "*://www." + site + "/*"]},
		["blocking"]);
	}
}

function disableBlocking(z){
	if(z == 0){
		chrome.webRequest.onBeforeRequest.removeListener(callback0);
	}
	else if(z == 1){
		chrome.webRequest.onBeforeRequest.removeListener(callback1);
	}
	else if(z == 2){
		chrome.webRequest.onBeforeRequest.removeListener(callback2);
	}
	else if(z == 3){
		chrome.webRequest.onBeforeRequest.removeListener(callback3);	
	}
	else if(z == 4){
		chrome.webRequest.onBeforeRequest.removeListener(callback4);
	}
	else if(z == 5){
		chrome.webRequest.onBeforeRequest.removeListener(callback5);	
	}
	else if(z == 6){
		chrome.webRequest.onBeforeRequest.removeListener(callback6);
	}
	else if(z == 7){
		chrome.webRequest.onBeforeRequest.removeListener(callback7);
	}
}

function unblockAll(){
	chrome.webRequest.onBeforeRequest.removeListener(callback0);
	chrome.webRequest.onBeforeRequest.removeListener(callback1);
	chrome.webRequest.onBeforeRequest.removeListener(callback2);
	chrome.webRequest.onBeforeRequest.removeListener(callback3);
	chrome.webRequest.onBeforeRequest.removeListener(callback4);	
	chrome.webRequest.onBeforeRequest.removeListener(callback5);
	chrome.webRequest.onBeforeRequest.removeListener(callback6);	
	chrome.webRequest.onBeforeRequest.removeListener(callback7);
	chrome.webRequest.onBeforeRequest.removeListener(blockAllCallback);
}
function addedCounter(act){
	if(act == "blocking"){
		n++;
	}
	else if(act == "unblocking"){
		n--;
	}
	else if(act == "ALL"){
		n = -1;
	}
	else if(act == "get"){
		n = n;
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