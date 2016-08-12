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
var confirmed = false;
var n;
//disable enter key cause it causes a ton of unforseen bugs
$('html').bind('keypress', function(e)
{
   if(e.keyCode == 13)
   {
      return false;
   }
});

function disablePopup(bool){
  if(bool){
    blockBttn.disabled = true;
    unblockAllBttn.disabled = true;
    blockAllBttn.disabled = true;
    permaBlockBttn.disabled = true;
    url.disabled = true;
    $("#status").addClass("unselectable");
  }
  else{
    blockBttn.disabled = false;
    unblockAllBttn.disabled = false;
    blockAllBttn.disabled = false;
    permaBlockBttn.disabled = false;
    url.disabled = false;
    $("#status").removeClass("unselectable");   
  }
}

//the dialog for the warning message that appears when the user decides to permanently block a site
$("#permblock-popup").dialog({
  autoOpen: false,
  draggable: false,
  //will disable the background when the popup is opened, so nothing can be interacted with except the popup
  open: function(event, ui) {
    $(".ui-dialog-titlebar-close", ui.dialog | ui).hide(); /*removes close button*/
    disablePopup(true);
  },
  close: function(event, ui){
    disablePopup(false);
  },
  buttons: [
      {
        text: "Ok",
        click: function() {
          confirmed = true;
          $(this).dialog("close");
            if(confirmed){
                //cookie that stores the number of sites you have added
                if (makeCookie.getItem('permCounter') == null) {
                    // If the cookie doesn't exist, save the cookie with the value of 1

                    //change null to infinity after testing so cookie does not expire. As user to enter a password in order to remove permabanned sites 
                    makeCookie.setItem('permCounter', '1', null);
                } else {
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
                  getBG.permablock(website);
                  makeCookie.setItem(getPermCounter, website, null);
                  getPermItems(getPermCounter);
                }
                else{
                  alert("You can only permablock up to three websites.");
                }
            }
        }
        //showText: false
      },

      {
        text: "Close",
        click: function() {
          $(this).dialog("close");
        }
        //showText: false
      }
    ]
});

$("#blockAll-popup").dialog({
  autoOpen: false,
  draggable: false,
  //will disable the background when the popup is opened, so nothing can be interacted with except the popup
  open: function(event, ui) {
    $(".ui-dialog-titlebar-close", ui.dialog | ui).hide(); /*removes close button*/
    disablePopup(true);
  },
  close: function(event, ui){
    disablePopup(false);
  },
  buttons: [
      {
        text: "Ok",
        click: function() {
          confirmed = true;
          $(this).dialog("close");
            if(confirmed){
                getBG.blockAllWebsites();
            }
        }
        //showText: false
      },

      {
        text: "Close",
        click: function() {
          $(this).dialog("close");
        }
        //showText: false
      }
    ]
})
$(".unblock-button").click(function(){
  var id = $(this).attr('id');
  var parseId = id.substring(id.length - 1, id.length);
  console.log(parseId);
  getBG.disableBlocking(parseId);
  getBG.addedCounter("unblocking");
  removeFromList(parseId);
})

$("#blockAll").on('click', function(){
  $("#blockAll-text").html("You are about to block all websites. Are you sure you want to do this?");
  $("#blockAll-popup").dialog("open");
})
//listens to the block button, and blocks the website entered into the input field once it's pressed
blockBttn.addEventListener('click', function(){
  website = url.value;
  n = getBG.addedCounter("blocking");
  console.log(n);
  getBG.enableBlocking(website, n);
  
  //regex expression to check whether the user inputted an empty string into the input field
  if(!(/\s/).test(website) && website != "" && (website.substring(0,4) != "www.")){
    tempSetKeys(n);
    console.log("2N = " + n);
    tempGetKeys();
  }
  else{
    alert("You did not enter a valid website!");
  }
});

//event listener for the permaban button, opens the popup to double check with user before banning
permaBlockBttn.addEventListener('click', function(){
  website = url.value;
  if(!(/\s/).test(website) && website != "" && (website.substring(0,4) != "www.")){
    $("#permblock-text").html("You are about to permanently block <b>" + website + "</b>. Are you sure you want to do this?");
    $("#permblock-popup").dialog("open");
  }
  else{
    alert("You did not enter a valid website!");
  }
});

//unblocks everthing when the unblock all button is clicked
unblockAllBttn.onclick = function(){
  getBG.unblockAll();

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

//checks whether popup is open or not
tempGetKeys();

//this function to store keys and their respected values to chrome local storage
function tempSetKeys(k){
    obj['website' + k] = website;
    local.set(obj, function(){
       if (chrome.extension.lastError) {
              alert("An error occurred: " + chrome.extension.lastError.message);
          }
    });
}
//grabbing the keys and their values and creating <li> elements to store them in
function tempGetKeys(){
    local.get(null, function(items){
      var allkeys = Object.keys(items);
      console.log(items);
      for(i = 0; i < allkeys.length; i++){
        var key = allkeys[i];
        $("#site" + i).text(items[key]);
        $("#unblock-" + i).removeClass("hide");
      }
    });
}

function removeFromList(n){
  local.remove('website'+n, function(items){
    console.log("Website removed");
  })
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

/*
//this function to store keys and their respected values to chrome sync storage
function permSetKeys(){
  //stores the website value to permobj variable
  permObj[website] = website;
  sync.set(permObj, function(){
    if(chrome.extension.lastError){
      alert("An error occured: " + chrome.extension.lastError.message);
    }
  })
}

function permGetKeys(){
    sync.get(null, function(items){
      var allkeys = Object.keys(items);
      console.log(allkeys);
      if(allkeys.length <= 3){
        for(i = 0; i < allkeys.length; i++){
          var key = allkeys[i];
          $("#perm" + i).text(items[key]);
          $("#permStat" + i).removeClass("hide");
        }
      }
      else{
          for(i = 0; i < 3; i++){
          var key = allkeys[i];
          $("#perm" + i).text(items[key]);
          $("#permStat" + i).removeClass("hide");
      }
    }
    });
}
*/
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