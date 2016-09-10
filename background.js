var obj = {};
var storage = chrome.storage.local;
var err = chrome.runtime.lastError;
var blockedNum;
var url;

var permanentlyBlock = function(details){
	console.log(details.timeStamp);
	return {redirectUrl: 'https://sinokaba.github.io/redirect/'};
}
var callback0 = function(details){
	console.log(details.timeStamp);
	return {cancel: true};
	changeBlockedSite();
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

function keepBlocked(){
	storage.get(null, function(items){
		var allkeys = Object.keys(items);
		var len = allkeys.length;
		if(len > 0){
			for(i = 0; i < len; i++){
				enableBlocking(allkeys[i], items[allkeys[i]], "entireWebsite");
			}
		}
	})

	for(i = 0; i <= 3; i++){
	    permablock(makeCookie.getItem(i.toString()));
	}
}

//cookie frame, for making cookies. taken from mozilla js docs
var makeCookie = {
  getItem: function (sKey) {
    if (!sKey) { return null; }
    return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
  },
  setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
    if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
    var sExpires = "";
    if (vEnd) {
      switch (vEnd.constructor) {
        case Number:
          sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
          break;
        case String:
          sExpires = "; expires=" + vEnd;
          break;
        case Date:
          sExpires = "; expires=" + vEnd.toUTCString();
          break;
      }
    }
    document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
    return true;
  },
  removeItem: function (sKey, sPath, sDomain) {
    if (!this.hasItem(sKey)) { return false; }
    document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
    return true;
  },
  hasItem: function (sKey) {
    if (!sKey) { return false; }
    return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
  },
  keys: function () {
    var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
    for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
    return aKeys;
  }
};


function makeCounter(action, counterName){
  //cookie that stores the number of sites you have added to permaban list
  if(makeCookie.getItem(counterName) == null){            
    // If the cookie doesn't exist, save the cookie with the value of 1

    //change null to infinity after testing so cookie does not expire. Ask user to enter a password in order to remove permabanned sites 
    makeCookie.setItem(counterName, '0', Infinity);
  }else{
    // If the cookie exists, take the value
    var tempCookieValue = makeCookie.getItem(counterName);
    // Convert the value to an int to make sure
    tempCookieValue = parseInt(tempCookieValue);
    // Add 1 to the cookie_value
    if(action == "inc"){
      tempCookieValue++;
    }
    else if(action == "dec"){
      tempCookieValue--;
    }
    // Or make a pretty one liner
    // cookie_value = parseInt(jQuery.cookie('shownDialog')) + 1;

    // Save the incremented value to the cookie
    makeCookie.setItem(counterName, tempCookieValue, Infinity);
    }  
}

keepBlocked();


function changeBlockedSite(){
    chrome.tabs.insertCSS(null, {file:"inject.css"})
}



function getMessage(){
	chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
		if(request.fn == "enableBlocking"){
			blockedNum = request.n;
			url = request.websiteURL;
			if(request.unit == "1"){
				enableBlocking(url, blockedNum, "entireWebsite", "pokusUnblockTimerM" + request.t);
				startTimer(request.t * 60, blockedNum);
			}
			else if(request.unit == "2"){
				enableBlocking(url, blockedNum, "entireWebsite", "pokusUnblockTimerHr" + request.t);
				startTimer(request.t * 3600, blockedNum);
			}
			else if(request.unit == "3"){
				enableBlocking(url, blockedNum, "entireWebsite", "pokusUnblockTimerD" + request.t);
				startTimer(request.t * 86400, blockedNum);
			}
			else{
				enableBlocking(url, blockedNum, "entireWebsite", "pokusNoUnblockTimer");
			}
		}
		else if(request.fn == "disableBlocking"){
			removeFromList(request.siteURL);
			disableBlocking(request.siteID);
		}
		else if(request.fn == "getBlockedInfo"){
			getBlockedInfo(request, sender, sendResponse);
		}
	})
}


function setKeys(url, siteID){
    obj[url] = siteID;
    storage.set(obj, function(){
       if (chrome.extension.lastError) {
              alert("An error occurred: " + chrome.extension.lastError.message);
          }
    });
}

function removeFromList(siteURL){
  storage.remove(siteURL, function(items){
    console.log("Website removed");
  })
}

function enableBlocking(site, x, scope, blockDuration){
	if(x == 0){
		if(scope == "entireWebsite"){
			chrome.webRequest.onBeforeRequest.addListener(callback0,
			{urls: ["*://" + site + "/*", "*://www." + site + "/*"]},
			["blocking"]);
		}else{
			chrome.webRequest.onBeforeRequest.addListener(callback0,
			{urls: ["*://" + site, "*://" + site + "/", "*://www." + site, "*://www." + site + "/"]},
			["blocking"]);			
		}
		setKeys(site + blockDuration, x);
	}
	else if(x == 1){
		if(scope == "entireWebsite"){
			chrome.webRequest.onBeforeRequest.addListener(callback1,
			{urls: ["*://" + site + "/*", "*://www." + site + "/*"]},
			["blocking"]);
		}else{
			chrome.webRequest.onBeforeRequest.addListener(callback1,
			{urls: ["*://" + site, "*://www." + site]},
			["blocking"]);				
		}
		setKeys(site + blockDuration, x);
	}
	else if(x == 2){
		if(scope == "entireWebsite"){
			chrome.webRequest.onBeforeRequest.addListener(callback2,
			{urls: ["*://" + site + "/*", "*://www." + site + "/*"]},
			["blocking"]);
		}else{
			chrome.webRequest.onBeforeRequest.addListener(callback2,
			{urls: ["*://" + site, "*://www." + site]},
			["blocking"]);						
		}
		setKeys(site + blockDuration, x);
	}
	else if(x == 3){
		if(scope == "entireWebsite"){
			chrome.webRequest.onBeforeRequest.addListener(callback3,
			{urls: ["*://" + site + "/*", "*://www." + site + "/*"]},
			["blocking"]);
		}else{
			chrome.webRequest.onBeforeRequest.addListener(callback3,
			{urls: ["*://" + site, "*://www." + site]},
			["blocking"]);						
		}
		setKeys(site, x);
	}
	else if(x == 4){
		if(scope == "entireWebsite"){
			chrome.webRequest.onBeforeRequest.addListener(callback4,
			{urls: ["*://" + site + "/*", "*://www." + site + "/*"]},
			["blocking"]);
		}else{
			chrome.webRequest.onBeforeRequest.addListener(callback4,
			{urls: ["*://" + site, "*://www." + site]},
			["blocking"]);						
		}
		setKeys(site, x);
	}
	else if(x == 5){
		if(scope == "entireWebsite"){
			chrome.webRequest.onBeforeRequest.addListener(callback5,
			{urls: ["*://" + site + "/*", "*://www." + site + "/*"]},
			["blocking"]);
		}else{
			chrome.webRequest.onBeforeRequest.addListener(callback5,
			{urls: ["*://" + site, "*://www." + site]},
			["blocking"]);						
		}
		setKeys(site, x);
	}
	else if(x == 6){
		if(scope == "entireWebsite"){
			chrome.webRequest.onBeforeRequest.addListener(callback6,
			{urls: ["*://" + site + "/*", "*://www." + site + "/*"]},
			["blocking"]);
		}else{
			chrome.webRequest.onBeforeRequest.addListener(callback6,
			{urls: ["*://" + site, "*://www." + site]},
			["blocking"]);						
		}
		setKeys(site, x);
	}
	else if(x == 7){
		if(scope == "entireWebsite"){
			chrome.webRequest.onBeforeRequest.addListener(callback7,
			{urls: ["*://" + site + "/*", "*://www." + site + "/*"]},
			["blocking"]);
		}else{
			chrome.webRequest.onBeforeRequest.addListener(callback7,
			{urls: ["*://" + site, "*://www." + site]},
			["blocking"]);						
		}
		setKeys(site, x);
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

	//remove before publishing
	chrome.webRequest.onBeforeRequest.removeListener(permanentlyBlock);
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

getMessage();

function extensionDialogs(dialog, item){
	if(dialog == "blockAll"){
		if(confirm("You are about to block all websites. Are you sure you want to do this?")){
			return true;
		}
		else{
			return false;
		}
	}
	else if(dialog == "permablock"){
		if(confirm("Are you sure you want to permablock '" + item + "'?")){
			return true;
		}else{
			return false;
		}
	}
	else if(dialog == "invalidURL"){
		alert("Please enter a valid URL.");
	}
	else if(dialog == "reachedLimit"){
		alert("You have blocked the maximum number of websites.");
	}
	else if(dialog == "unblockAll"){
		if(confirm("Are you sure you want to unblock all the websites on your blocklist?")){
			return true;
		}
		else{
			return false;
		}
	}
	else if(dialog == "invalidTime"){
		alert("You did not enter a valid value for the amount of time the website should be blocked for.");
	}
	else if(dialog == "unblockConfirm"){
		if(confirm("Are you sure you want to unblock " + item + "?")){
			return true;
		}
		else{
			return false;
		}
	}
}

function startTimer(duration, siteID){
	var startTime = Math.floor(Date.now() / 1000);
    var endTime = duration + startTime;
  	if(siteID == 0){
    	var countdownInterval0 = setInterval(function(){
        formatTime(countdownInterval0, siteID, endTime);
  		}, 1000);
  	}
  	else if(siteID == 1){
    	var countdownInterval1 = setInterval(function(){
        formatTime(countdownInterval1, siteID, endTime);
  		}, 1000);  		
  	}
  	else if(siteID == 2){
    	var countdownInterval2 = setInterval(function(){
        formatTime(countdownInterval2, siteID, endTime);
  		}, 1000);  		
  	}
  	else if(siteID == 3){
    	var countdownInterval3 = setInterval(function(){
        formatTime(countdownInterval3, siteID, endTime);
  		}, 1000);  		
  	}
  	else if(siteID == 4){
    	var countdownInterval4 = setInterval(function(){
        formatTime(countdownInterval4, siteID, endTime);
  		}, 1000);  		
  	}
}

function formatTime(intervalName, siteID, endTime){
	startTime = Math.floor(Date.now() / 1000);
    var dur = endTime - startTime;
    var day = Math.floor(dur/86400);
	var hr = Math.floor((dur/3600) % 24);
    var min = Math.floor((dur/60) % 60);
    var sec = Math.floor(dur % 60);
    day = day < 10 ? "0" + day : day;
    hr = hr < 10 ? "0" + hr : hr;
    min = min < 10 ? "0" + min : min;
    sec = sec < 10 ? "0" + sec : sec;
    if(dur >= 86400){
    	//chrome.runtime.sendMessage(id : siteID, d : day, h : hr, m : min);
    	console.log(day + ":" + hr + ":" + min);
    }
	else if(dur >= 3600){
      	console.log(hr + ":" + min);     
    }
    else if(dur >= 60){
      	console.log(min + ":" + sec);
      	chrome.runtime.sendMessage({m:min, s: sec, id: siteID});       
    }
    else{
       	console.log(sec + " seconds");
    }
    if(startTime >= endTime){
        disableBlocking(siteID);
	    console.log("countdown over, website no longer blocked");
	    stopCountdown(intervalName);
    }	
}
function stopCountdown(interval){
	if(interval == "all"){
		for(i = 0; i < blockedNum; i++){
			clearInterval("countdownInterval" + i);
		}
	}
	else{
		clearInterval(interval);
	}
}

chrome.contextMenus.create({
  title: "Block this website", 
  contexts:["page"], 
  onclick: rightClickBlock
});

//gives user the ability to block a site when they right click a webpage
function rightClickBlock(info, tab) {
  console.log("This webpage has been blocked.");
  var ogURL = info.pageUrl;
  var formattedURL;
  makeCounter("inc", "tempCounter");
  var n = makeCookie.getItem("tempCounter");
  if(ogURL.substring(ogURL.length - 1, ogURL.length) == "/"){
  	temp = ogURL.substring(0, ogURL.length - 1);
  }
  else{
  	temp = ogURL;
  }
  if(temp.indexOf("http://") != -1){
  	formattedURL = temp.substring(7, temp.length);
  }
  else if(temp.indexOf("https://") != -1){
  	formattedURL = temp.substring(8, temp.length);
  }
  else{
  	formattedURL = temp;
  }
  var newURL = formattedURL.split("/");
  var userConfirm = confirm("Are you sure you want to block this website?");
  if(userConfirm){
    var userAction = confirm("Hit 'yes' to block the entire website, or 'cancel' to only block this webpage.");
  	if(userAction){
  		enableBlocking(newURL[0], n, "entireWebsite", "pokusNoUnblockTimer");
  	}
  	else{
		enableBlocking(formattedURL, n, "onlyThis", "pokusNoUnblockTimer");
  	}
  }
}