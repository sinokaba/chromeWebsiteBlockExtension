window.onload = function(){

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

$("#warning-popup").dialog({
  autoOpen: false,
  draggable: false,
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
                console.log(confirmed);
                permSetKeys();
                permGetKeys();
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

buttonID.addEventListener('click', function(){
  website = textbox.value;
  getBG.enableBlocking(website);
  
  if(!(/\s/).test(website) && website != ""){
    tempSetKeys();
    tempGetKeys();
  }
  else{
    alert("You did not enter a valid website!");
  }
});

document.getElementById("permaban").addEventListener('click', function(){
  warning = true;
  website = textbox.value;
  $("#warning-text").html("You are about to permanently block <b>" + website + "</b>. Are you sure you want to do this?");
  getBG.enableBlocking(website);
  $("#warning-popup").dialog("open");
});

textbox.addEventListener("keydown", function(event) {
  if (event.keyCode == 13) {
    buttonID.click();
  }
});



unBlock.value = "Unblock All";



unBlock.onclick = function(){
  getBG.disableBlocking();
  local.clear(function(){
    err = chrome.runtime.lastError;
    if(err){
      alert("An error occured, could not remove item.");
    }
  });
  sync.clear();
  chrome.runtime.reload();
}

if(chrome.extension.getViews({ type: "popup" }) != '[]'){
  tempGetKeys();
  permGetKeys();
}

function tempGetKeys(){
    local.get(null, function(items){
      var allkeys = Object.keys(items);
      console.log(allkeys);
      for(i = 0; i < allkeys.length; i++){
      var li = document.createElement('li');
      li.setAttribute('id', 'site' + i);
      document.getElementById("blockList").appendChild(li)
      document.getElementById("site" + i).innerHTML = allkeys[i];
      }
    });
}

function tempSetKeys(){
    obj[website] = website;
    local.set(obj, function(){
       if (chrome.extension.lastError) {
              alert("An error occurred: " + chrome.extension.lastError.message);
          }
    });
}

function permSetKeys(){
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
      for(i = 0; i < allkeys.length; i++){
      var li = document.createElement('li');
      li.setAttribute('id', 'pSite' + i);
      document.getElementById("permbanned").appendChild(li)
      document.getElementById("pSite" + i).innerHTML = allkeys[i];
      }
    });
}
}
