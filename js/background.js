var obj = {}, storage = chrome.storage.local, err = chrome.runtime.lastError, blockedNum, Data = Array(), tbCount = 10;

var permanentlyBlock = function(details){
	console.log(details.timeStamp);
	chrome.tabs.executeScript({
		code: 'document.body.style.backgroundColor="red"'
	});	
	return {redirectUrl: 'https://sinokaba.github.io/redirect/'};
}

var blockRequest = [];
for(var i = 0; i < 3; i++){
	blockRequest[i] = function(details){
		return {cancel: true};
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
    var cookieValue = makeCookie.getItem(counterName);
    // Convert the value to an int to make sure
    cookieValue = parseInt(cookieValue);
    // Add 1 to the cookie_value
    if(action == "inc"){
      cookieValue++;
    }
    else if(action == "dec"){
      cookieValue--;
    }
    // Or make a pretty one liner
    // cookie_value = parseInt(jQuery.cookie('shownDialog')) + 1;

    // Save the incremented value to the cookie
    makeCookie.setItem(counterName, cookieValue, Infinity);
    }  
}

function loadOldData(){
	storage.get("data", function(result){
		var rawD = Object.keys(result).map(function (key){ 
        	return result[key]; 
	    });
	    if(rawD.length > 0){
	    	console.log(rawD);
		    var len = rawD[0].match((/\[/g) || []).length - 1; 
		    console.log(len);
			var temp = rawD[0].replace(/['"]+/g, '');
		    var tempParsed = temp.split(']');
		    var info = [];
	        for(var  i = 0; i < len; i++){
				var d = tempParsed[i].split('[');
				var oldData = d[1].split(',');
			   	if(i == 0){
			   		oldData = d[2].split(',');
			    }
			    Data.push(oldData);
		    }
		    console.log(Data);
		    for(var i = 0; i < Data.length; i++){
		    	if(Data[i][3] == "N/A"){
		    		updateFilters("n");
		    	}
		    	else if(Data[i][3] == "INFN"){
		    		updateFilters()
		    	}
		    	else{
		    		updateFilters("t");
		    	}
		    }
		}
	});
}

loadOldData();
console.log(Data);

//test
function addSite(sInfo){
	console.log(Data);
	Data.push(sInfo);
	storage.set({"data": JSON.stringify(Data)}, function(){
		if(chrome.extension.lastError) {
			alert("An error occurred: " + chrome.extension.lastError.message);
		}
    });
    if(sInfo[3] == "N/A"){
		updateFilters("n");
	}
	else if(sInfo[3] == "INFN"){
		updateFilters("i");
	}
	else{
		updateFilters("t");
	}
}

function removeSite(index, type){
	Data.splice(index, 1);
	storage.set({"data": JSON.stringify(Data)}, function(){
		if(chrome.extension.lastError) {
			alert("An error occurred: " + chrome.extension.lastError.message);
		}
    });
    console.log(Data);
    updateFilters(type);
}

function updateFilters(type){
	console.log("you called me");
	var nUrls = [];
	var tUrls = [];
	var tDates = [];
	var iUrls = [];
	for(var i = 0; i < Data.length; i++){
		if(Data[i][3] == "N/A"){
			nUrls.push("*://" + Data[i][1]+ "/*", "*://www." + Data[i][1] + "/*", "*://m." + Data[i][1] + "/*");
		}
		else if(Data[i][3] == "INFN"){
			iUrls.push("*://" + Data[i][1]+ "/*", "*://www." + Data[i][1] + "/*", "*://m." + Data[i][1] + "/*");		
		}
		else{
			tUrls.push("*://" + Data[i][1]+ "/*", "*://www." + Data[i][1] + "/*", "*://m." + Data[i][1] + "/*");
			tDates.push(Data[i][4]);
		}	
	}
	if(type == "n"){
		if(nUrls.length > 0){
			normBlocking(nUrls);
		}
		else{
	    	chrome.webRequest.onBeforeRequest.removeListener(blockRequest[0]);
		}
	}
	else if(type == "t"){
		if(tUrls.length > 0){
			timeBlocking(tUrls, tDates, "comp");
		}
		else{
			chrome.webRequest.onBeforeRequest.removeListener(blockRequest[1]);		
		}
	}
	else if(type == "i"){
		if(iUrls.length > 0){
			infnBlocking(iUrls);
		}
		else{
	    	chrome.webRequest.onBeforeRequest.removeListener(blockRequest[2]);
		}
	}
	else{
		chrome.webRequest.onBeforeRequest.removeListener(blockRequest[0]);
		chrome.webRequest.onBeforeRequest.removeListener(blockRequest[1]);
	}
}

function normBlocking(urls) {
	if(chrome.webRequest.onBeforeRequest.hasListener(blockRequest[0])){
		console.log(urls);
    	chrome.webRequest.onBeforeRequest.removeListener(blockRequest[0]);
	};
	console.log(urls);
	chrome.webRequest.onBeforeRequest.addListener(blockRequest[0],
	{urls: urls},['blocking']);
}

function timeBlocking(urls, tDates, scope){
	if(chrome.webRequest.onBeforeRequest.hasListener(blockRequest[1])){
		console.log(urls);
    	chrome.webRequest.onBeforeRequest.removeListener(blockRequest[1]);
	};
	if(scope == "comp"){
		chrome.webRequest.onBeforeRequest.addListener(blockRequest[1],
		{urls: urls},
		["blocking"]);
	}else{
		chrome.webRequest.onBeforeRequest.addListener(blockRequest[1],
		{urls: urls},
		["blocking"]);			
	}
	var counter = 0;
	var timer = setInterval(function(){
		var curTime = Date.now();
		for(var i = 0; i < tDates.length; i++){
			console.log(Math.floor((tDates[i] - curTime)/1000));
			if(curTime >= tDates[i]){
				counter++;
		    	for(var k = 0; k < Data.length; k++){
		    		if(Data[k][4] == tDates[i]){
		    			alert(Data[k][1] + " has been unblocked!");
			   			removeSite(k, "t");
			   		}
			   	}
			   	console.log(counter + " " + tDates.length) ;
				if(counter == tDates.length){
					console.log("yeaa i clear it mang");
					clearInterval(timer);
				}
			}
		}
	}, 1000);
}

function infnBlocking(urls){
	chrome.webRequest.onBeforeRequest.addListener(blockRequest[2],
	{urls: urls},
	["blocking"]);
}

function unblockAll(){
	if(chrome.webRequest.onBeforeRequest.removeListener(blockRequest[3])){
		chrome.webRequest.onBeforeRequest.removeListener(blockRequest[3]);	
	};
	//remove before publishing
	chrome.webRequest.onBeforeRequest.removeListener(permanentlyBlock);
	Data.length = 0;
	updateFilters();
	storage.clear(function(){
		var err = chrome.runtime.lastError;
		if(err){
			console.log(err);
		}	
	})
}

function blockAllWebsites(){
	chrome.webRequest.onBeforeRequest.addListener(blockRequest[3], 
	{urls: ["http://*/*", "https://*/*"]},
	["blocking"]);
}


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
	else if(dialog == "alreadyBlocked"){
		alert("You have already blocked this website!");
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
  		enableBlocking(newURL[0], n, "comp");
		startTimer("na", n);
  	}
  	else{
  		console.log(formattedURL);
		enableBlocking(formattedURL, n, "partial");
		startTimer("na", n);
  	}
  }

};
