window.onload = function(){
//all the global vars i'm using
var obj = {};
var permObj = {};
var local = chrome.storage.local;
var sync = chrome.storage.sync;
var website;
var getBG = chrome.extension.getBackgroundPage();
var err;
var textbox = document.getElementById("blockSite");
var buttonID = document.getElementById("blockNow");
var unBlock = document.getElementById("unblockNow");
var warning = false;
var confirmed = false;
var n;
var x = getBG.removedCounter();
//disable enter key cause it causes a ton of unforseen bugs
$('html').bind('keypress', function(e)
{
   if(e.keyCode == 13)
   {
      return false;
   }
});

//remove after project is finished
sync.clear();

//the dialog for the warning message that appears when the user decides to permanently block a site
$("#warning-popup").dialog({
  autoOpen: false,
  draggable: false,

  //will disable the background when the popup is opened, so nothing can be interacted with except the popup
  open: function(event, ui) {
    $("#status").css("opacity", ".7");
    document.getElementById("blockNow").disabled = true;
    document.getElementById("unblockNow").disabled = true;
    document.getElementById("permaban").disabled = true;
    document.getElementById("blockSite").disabled = true;
    $(".button-style").css("cursor", "default");
    $(".ui-dialog-titlebar-close", ui.dialog | ui).hide();
  },
  close: function(event, ui){
    $("#status").css("opacity", "1");
    document.getElementById("blockNow").disabled = false;
    document.getElementById("unblockNow").disabled = false;
    document.getElementById("permaban").disabled = false;
    document.getElementById("blockSite").disabled = false;
    $(".button-style").css("cursor", "pointer");
  },
  buttons: [
      {
        text: "Ok",
        click: function() {
          confirmed = true;
          $( this ).dialog( "close" );
            if(confirmed){
              if(!(/\s/).test(website) && website != ""){
                if (makeCookie.getItem('counter') == null) {
                    // If the cookie doesn't exist, save the cookie with the value of 1

                    //change null to infinity after testing so cookie does not expire. As user to enter a password in order to remove permabanned sites 
                    makeCookie.setItem('counter', '1', null);
                } else {
                    // If the cookie exists, take the value
                    var cookie_value = makeCookie.getItem('counter');
                    // Convert the value to an int to make sure
                    cookie_value = parseInt(cookie_value);
                    // Add 1 to the cookie_value
                    cookie_value++;

                    // Or make a pretty one liner
                    // cookie_value = parseInt(jQuery.cookie('shownDialog')) + 1;

                    // Save the incremented value to the cookie
                    makeCookie.setItem('counter', cookie_value, null);
                }
                var getCounter = makeCookie.getItem('counter');
                if(getCounter <= 3){
                  getBG.permaban(website);
                  makeCookie.setItem(getCounter, website, null);
                  getPermItems(getCounter);
                }
                else{
                  alert("You can only permablock up to three websites.");
                }
              }
              else{
                alert("You did not enter a valid website!");
              }
            }
        }
        //showText: false
      },

      {
        text: "Close",
        click: function() {
          $( this ).dialog( "close" );
        }
        //showText: false
      }
    ]
});

$(".unblock-button").click(function(){
  var id = $(this).attr('id');
  var parseId = id.substring(id.length - 1, id.length);
  console.log(parseId);
  getBG.disableBlocking(parseId);
  removeFromList(parseId);
  getBG.removedCounter();
})

//listens to the block button, and blocks the website entered into the input field once it's pressed
buttonID.addEventListener('click', function(){
  website = textbox.value;
  n = getBG.addedCounter() - x;
  console.log("X = " + x);
  console.log("N = " + n);
  getBG.enableBlocking(website, n);
  
  //regex expression to check whether the user inputted an empty string into the input field
  if(!(/\s/).test(website) && website != ""){
    tempSetKeys(n);
    console.log("2N = " + n);
    tempGetKeys();
  }
  else{
    alert("You did not enter a valid website!");
  }
});

//event listener for the permaban button, opens the popup to double check with user before banning
document.getElementById("permaban").addEventListener('click', function(){
  warning = true;
  website = textbox.value;
  $("#warning-text").html("You are about to permanently block <b>" + website + "</b>. Are you sure you want to do this?");
  getBG.enableBlocking(website);
  $("#warning-popup").dialog("open");
});

//unblocks everthing when the unblock all button is clicked
unBlock.onclick = function(){
  getBG.unblockAll();

  //clears both local and sync chrome storage systems
  local.clear(function(){
    err = chrome.runtime.lastError;
    if(err){
      alert("An error occured, could not remove item.");
    }
  });
  //reloads the extension, closes the popup
}

//checks whether popup is open or not
if(chrome.extension.getViews({ type: "popup" }) != '[]'){
  tempGetKeys();
}

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


for(i = 1; i <= 3; i++){
    $("#perm" + i).text(makeCookie.getItem(i));
    $("#permStat" + i).removeClass("hide");
}

function getPermItems(n){
  for(i = 1; i <= n; i++){
    console.log(makeCookie.getItem(i));
    $("#perm" + i).text(makeCookie.getItem(i));
    $("#permStat" + i).removeClass("hide");
  }
}

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

}