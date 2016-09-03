window.onload = function(){
//all the global vars i'm using
var obj = {};
var local = chrome.storage.local;
var website;
var getBG = chrome.extension.getBackgroundPage();
var err = chrome.runtime.lastError;
var url = document.getElementById("websiteURL");
var blockBttn = document.getElementById("blockNow");
var unblockAllBttn = document.getElementById("unblockAll");
var blockAllBttn = document.getElementById("blockAll");
var permaBlockBttn = document.getElementById("permablock");
var getReason = document.getElementById("comment");
var reason;
var websiteURL;
var urlList;

$(".tab-link").each(function(){
  $(this).click(function(e){
    var temp = e.target.id.split('-');
    var tabID = temp[0];
    $(".tab-link").removeClass("active");
    $(this).addClass("active");
    $(".tabCon").addClass("hide");
    $("#"+tabID).removeClass("hide");
    return false;
  })
})

$("#list-link").click(function(){
  tempGetKeys();
})
$("#home-link").click(function(){
  //clears input field
  $(".input-field").val('');
})
//disable enter key cause it causes a ton of unforseen bugs
$('html').bind('keypress', function(e)
{
   if(e.keyCode == 13)
   {
      return false;
   }
});

//checks if url exists
function ValidURL(str) {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
  '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  if(!pattern.test(str)) {
    return false;
  } else {
    return true;
  }
}

//trims url if it contains protocols, or www.
function trimURL(url){
  var trimmedURL = "";
  if(url.indexOf("http://") != -1){
    trimmedURL = url.substring(7, url.length);
  }
  else if(url.indexOf("https://") != -1){
    trimmedURL = url.substring(8, url.length);
  }
  else{
    trimmedURL = url;
  }
  if(trimmedURL.indexOf("www.") != -1){
    trimmedURL = trimmedURL.substring(4, url.length);
  }
  return trimmedURL;
}

$(".unblock-button").click(function(){
  var buttonID = $(this).attr('id');
  var siteID = buttonID.substring(buttonID.length - 1, buttonID.length);
  var unblockThis = $("#site"+siteID).text();

  //need to grab key value;
  local.get(unblockThis, function(items){
    chrome.runtime.sendMessage({siteID: items[unblockThis], siteURL: unblockThis, fn: "disableBlocking"});
  });
  tempGetKeys();
})


$("#blockAll").click(function(){
  if(getBG.extensionDialogs("blockAll", "")){
    getBG.blockAllWebsites();
  }

});
//listens to the block button, and blocks the website entered into the input field once it's pressed
$("#blockNow").click(function(){
  websiteURL = url.value;
  if(ValidURL(websiteURL)){
    websiteURL = trimURL(websiteURL);
    chrome.runtime.sendMessage({websiteURL: websiteURL, reason: getReason.value, fn: "enableBlocking"});
  }
  else{
    getBG.extensionDialogs("invalidURL", websiteURL)
  }
  $(".input-field").val('');

});

//event listener for the permaban button, opens the popup to double check with user before banning
$("#permablock").click(function(){
  websiteURL = url.value;

  if(ValidURL(websiteURL)){
    if(getBG.extensionDialogs("permablock", websiteURL)){
      //cookie that stores the number of sites you have added to permaban list
      if(makeCookie.getItem('permCounter') == null){            
      // If the cookie doesn't exist, save the cookie with the value of 1

      //change null to infinity after testing so cookie does not expire. As user to enter a password in order to remove permabanned sites 
        makeCookie.setItem('permCounter', '1', null);
      }else{
      // If the cookie exists, take the value
        var permCookieValue = makeCookie.getItem('permCounter');
      // Convert the value to an int to make sure
        permCookieValue = parseInt(permCookieValue);
      // Add 1 to the cookie_value
        permCookieValue++;

      // Or make a pretty one liner
      // cookie_value = parseInt(jQuery.cookie('shownDialog')) + 1;

      // Save the incremented value to the cookie
        makeCookie.setItem('permCounter', permCookieValue, null);
      }

      var getPermCounter = makeCookie.getItem('permCounter');
      if(getPermCounter <= 3){
        getBG.permablock(websiteURL);
        websiteURL = trimURL(websiteURL);
        makeCookie.setItem(getPermCounter, websiteURL, null);
        getPermItems(getPermCounter);
      }
      else{
        getBG.extensionDialogs("reachedLimit", websiteURL);
      }
    }
    
  }
  else{
    getBG.extensionDialogs("invalidURL", websiteURL);
  }
});

//unblocks everthing when the unblock all button is clicked
$("#unblockAll").click(function(){
  if(getBG.extensionDialogs("unblockAll", "")){
    getBG.unblockAll();

    getBG.addedCounter("ALL");

    //remove after testing
    clearCookies();

    //clears chrome  local storage systems
    local.clear(function(){
      if(err){
        alert("An error occured, could not remove item.");
      }
    });
    tempGetKeys();
  }
});


//this function to store keys and their respected values to chrome local storage
function tempSetKeys(k){
    obj['website' + k] = website;
    local.set(obj, function(){
       if (chrome.extension.lastError) {
              alert("An error occurred: " + chrome.extension.lastError.message);
          }
    });
}

//grabbing the keys and their values
function tempGetKeys(){
  console.log("you called meee");
    local.get(null, function(items){
      var allkeys = Object.keys(items);
      var len = allkeys.length;
      console.log(len);

      //sort list based on the date they were added
      if(allkeys.length > 0){
        for(urlList = []; urlList.length < allkeys.length; urlList.push([]));
        for (i = 0; i < allkeys.length; i++){
          urlList[i][0] = allkeys[i];
          urlList[i][1] = items[allkeys[i]];
        }
        urlList.sort(function (a, b) {
          if (a[1] > b[1]) {
            return 1;
          }
          if (a[1] < b[1]) {
            return -1;
          }
          // a must be equal to b
          return 0;
        });
      }

      //call createlist function so the list of block sites will show up in the popup
      createList(urlList, len);
    });
}

function createList(urlList, listLen){
  for(i = 0; i < listLen; i++){
    if(urlList[i][0].length > 20){
      var part1 = urlList[i][0].substring(0, 20);
      var part2 = urlList[i][0].substring(20, urlList[i][0].length);
      document.getElementById("site" + i).innerHTML = part1 + "<a class='showMore'>...</a>";
      $("#unblock-" + i).removeClass("hide");
    }
    else{
      document.getElementById("site" + i).innerHTML = (urlList[i][0]);
      $("#unblock-" + i).removeClass("hide");
      console.log(urlList[i][0])
    }
  }
}

$(".more").click(function(){
    $(this).text("less..").siblings(".complete").show();    
}, function(){
    $(this).text("more..").siblings(".complete").hide();    
});


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

//so the list of perma blocked sites doesn't dissappear after the popup is closed and reopened
for(i = 1; i <= 3; i++){
    $("#perm" + i).text(makeCookie.getItem(i));
}

function getPermItems(n){
  for(i = 1; i <= n; i++){
    console.log(makeCookie.getItem(i));
    $("#perm" + i).text(makeCookie.getItem(i));
    $("#permStat" + i).removeClass("hide");
  }
}

//remove after finished with testing
function clearCookies(){
  if(makeCookie.getItem("permCounter") != null){
    makeCookie.removeItem("permCounter");
  }
  var items = document.cookie.split(';');
  for(i = 0; i < makeCookie.keys().length; i++){
    var key2 = items[i].split('=');
    console.log("length: " + makeCookie.keys().length + "items: " + key2[0]);
    makeCookie.removeItem(key2[0]);
  }
}

}