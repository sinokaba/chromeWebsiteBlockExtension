const storage = chrome.storage.local, err = chrome.runtime.lastError;
var Data = Array();

chrome.runtime.onUpdateAvailable.addListener(function(details) {
    chrome.runtime.reload();
});

var blockRequest = [];
for (var i = 0; i < 3; i++) {
    blockRequest[i] = function(details) {
        if (details.frameId !== 0) {
            // Don't trigger on iframes
            return;
        }
        //stores tabid to local storage, when a blocked url is accessed an alternate js file access local storage with tab id to get url
        //since url becomes redirect url, don't want that
        var tabIdToUrl = {};
        tabIdToUrl[details.tabId.toString()] = details.url;
        storage.set(tabIdToUrl);

        return {
            redirectUrl: chrome.extension.getURL("redirect.html")
        };
    }
}

function loadOldData() {
    storage.get("data", function(result) {
        var rawD = Object.keys(result).map(function(key) {
            return result[key];
        });
        if (rawD.length > 0) {
            var len = rawD[0].match((/\[/g) || []).length - 1;
            var temp = rawD[0].replace(/['"]+/g, '');
            var tempParsed = temp.split(']');
            var info = [];
            for (var i = 0; i < len; i++) {
                var d = tempParsed[i].split('[');
                var oldData = d[1].split(',');
                if (i == 0) {
                    oldData = d[2].split(',');
                }
                Data.push(oldData);
            }
            for (var i = 0; i < Data.length; i++) {
                if (Data[i][3] == "N/A") {
                    updateFilters("norm");
                } else if (Data[i][3] == "INFN") {
                    updateFilters("infn");
                } else {
                    updateFilters("time");
                }
            }
        }
    });
}

loadOldData();

//alarm test
chrome.alarms.onAlarm.addListener(function(alarm) {
})

//cookie frame, for making cookies. taken from mozilla js docs
var makeCookie = {
    getItem: function(sKey) {
        if (!sKey) {
            return null;
        }
        return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
    },
    setItem: function(sKey, sValue, vEnd, sPath, sDomain, bSecure) {
        if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) {
            return false;
        }
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
    removeItem: function(sKey, sPath, sDomain) {
        if (!this.hasItem(sKey)) {
            return false;
        }
        document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
        return true;
    },
    hasItem: function(sKey) {
        if (!sKey) {
            return false;
        }
        return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
    },
    keys: function() {
        var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
        for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) {
            aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]);
        }
        return aKeys;
    }
};

function addSite(sInfo) {
    Data.push(sInfo);
    storage.set({
        "data": JSON.stringify(Data)
    }, function() {
        if (err) {
            alert("An error occurred: " + err.message);
        }
    });

    if (sInfo[3] == "N/A") {
        updateFilters("norm");
    } else if (sInfo[3] == "INFN") {
        updateFilters("infn");
    } else {
        updateFilters("time");
    }
}

function removeSite(index, type) {
    Data.splice(index, 1);
    storage.set({
        "data": JSON.stringify(Data)
    }, function() {
        if (err) {
            alert("An error occurred: " + err.message);
        }
    });
    updateFilters(type);
}

function updateFilters(type){
    console.log("you called me " + type);
    var nUrls = [];
    var tUrls = [];
    var tDates = [];
    var iUrls = [];
    for(var i = 0; i < Data.length; i++){
        if(Data[i][3] == "N/A"){
            nUrls.push("*://*." +  Data[i][1] + "/*");
        }
        else if(Data[i][3] == "INFN"){
            iUrls.push("*://*." +  Data[i][1] + "/*");        
        }
        else{
            tUrls.push("*://*." +  Data[i][1] + "/*");
            tDates.push(Data[i][4]);
        }   
    }
    if(type == "norm"){
        block(blockRequest[0], nUrls, null);
    }
    else if(type == "time"){
        block(blockRequest[1], tUrls, tDates);
    }
    else if(type == "infn"){
        block(blockRequest[2], iUrls, null);
    }
    else{
        chrome.webRequest.onBeforeRequest.removeListener(blockRequest[0]);
        chrome.webRequest.onBeforeRequest.removeListener(blockRequest[1]);
    }
}

function block(blockRequestType, urls, dates){
    console.log(urls);
    if(urls.length > 0){
        console.log("blocking");
        if(chrome.webRequest.onBeforeRequest.hasListener(blockRequestType)){
            chrome.webRequest.onBeforeRequest.removeListener(blockRequestType);
        };
        chrome.webRequest.onBeforeRequest.addListener(blockRequestType, {urls: urls}, ['blocking']);    
        if(dates != null){
            timeBlocking(urls, dates);
        }
    }
    else{
        chrome.webRequest.onBeforeRequest.removeListener(blockRequestType);             
    }
}

function timeBlocking(urls, tDates){
    var counter = 0;
    //perhaps instead of using setInterval, use chrome.alarms.create 
    var timer = setInterval(function() {
        var curTime = Date.now();
        for (var i = 0; i < tDates.length; i++) {
            if (curTime >= tDates[i]) {
                counter++;
                for (var k = 0; k < Data.length; k++) {
                    if (Data[k][4] == tDates[i]) {
                        chrome.notifications.create('reminder', {
                            type: 'basic',
                            iconUrl: 'img/pokusIcon128.png',
                            title: 'Website Unblocked',
                            message: '"' + Data[k][1] + '" is now unblocked.'
                        }, function(notificationId) {
                        });
                        removeSite(k, "time");
                    }
                }
                if (counter == tDates.length) {
                    clearInterval(timer);
                }
            }
        }
    }, 1000);
}


function unblockAll() {
    for (var i = 0; i < Data.length; i++) {
        if (Data[i][3] != "INFN") {
            if (Data[i][3] == "N/A") {
                removeSite(i, "norm");
            } else {
                removeSite(i, "time");
            }
            unblockAll();
        }
    }
}

function extensionDialogs(cmd, item) {
    switch(cmd){
        case "permablock":
            return confirm("Are you sure you want to permablock '" + item + "'?");
        case "invalidURL":
            alert("Please enter a valid URL.");
            break;
        case "reachedLimit":
            alert("You have blocked the maximum number of websites.");
            break;
        case "invalidTime":
            alert("You did not enter a valid value for the amount of time the website should be blocked for.");
            break;
        case "unblockConfirm":
            return confirm("Are you sure you want to unblock " + item + "?");
        case "alreadyBlocked":
            alert("You have already blocked this website!");
            break;
        case "overrideSave":
            return confirm("A saved list already exists, are you sure you want to override it?");
        case "noSave":
            alert("You do not have a saved list.");
            break;
        case "listSaved":
            alert("Your block list has been saved!");
            break;
        case "setPw":
            return prompt("This password will be asked everytime you attempt to permablock a site, or unban all sites in a list." +
            " It must be at least 4 characters in length: ");         
        case "pwShort":
            return prompt("Password entered was too short, try again.");
        case "changePw":
            return confirm("You have already set a password, would you like to change it?");
        case "tooManyTries":
            alert("Too many failed password attempts. Try again later.");
            break;
        case "enterPw":
            return prompt("After 4 tries you will not be able to access password guarded features for 2 hours. Enter Your Current Password: ");
        case "unblockAll":
            return confirm("Are you sure you want to unblock all the websites on this list?");
        default:
            alert("Invalid command");
    }
}

chrome.contextMenus.create({
    title: "Block this website",
    contexts: ["page"],
    onclick: rightClickBlock
});


function enterPW() {
    var attempts = 0;
    var correct = false;
    while (attempts < 4 && correct == false) {
        var input = extensionDialogs("enterPw", "");
        if (input === makeCookie.getItem("pw")) {
            correct = true;
        } else if (input == null) {
            correct = "cancelled";
        } else {
            attempts++;
        }
    }
    return correct;
}


function setPW() {
    var pass = extensionDialogs("setPw", "");
    while (pass.length < 4) {
        pass = extensionDialogs("pwShort", "");
    }
    makeCookie.setItem("pw", pass, Infinity);
}

function failedPW() {
    if (makeCookie.getItem("failedPWAttemps") == null) {
        makeCookie.setItem("failedPWAttemps", "wrongPassword", 7200);
    }
    extensionDialogs("tooManyTries");
}

function unique(url) {
    var uq = true;
    for (var j = 0; j < Data.length; j++) {
        if (url.indexOf(Data[j][1]) != -1) {
            uq = false;
        }
    }
    return uq;
}

//trims url if it contains protocols, or www.
function trim(rawUrl) {
    var urlPrefixList = ["http://www.", "https://www.", "http://", "https://", "www."];
    for (var i = 0; i < urlPrefixList.length; i++) {
        if (rawUrl.indexOf(urlPrefixList[i]) != -1) {
            rawUrl = rawUrl.substring(urlPrefixList[i].length, rawUrl.length);
        }
    }
    return rawUrl;
};

//gives user the ability to block a site when they right click a webpage
function rightClickBlock(info, tab) {
    var newURL = trim(info.pageUrl).split("/");
    if (confirm("Are you sure you want to block this website?")) {
        if (unique(newURL[0])) {
            addSite(["n", newURL[0], "", "N/A"]);
            chrome.tabs.reload();
        } else {
            extensionDialogs("alreadyBlocked", "k");
        }
    }

};