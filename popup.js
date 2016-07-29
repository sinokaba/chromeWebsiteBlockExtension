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
var n = -1;
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

//listens to the block button, and blocks the website entered into the input field once it's pressed
buttonID.addEventListener('click', function(){
  website = textbox.value;
  n++;
  document.cookie = n;
  getBG.enableBlocking(website, document.cookie);
  
  //regex expression to check whether the user inputted an empty string into the input field
  if(!(/\s/).test(website) && website != ""){
    tempSetKeys(n);
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

//triggers the click event when the user presses enter when entering a site
textbox.addEventListener("keydown", function(event) {
  if (event.keyCode == 13) {
    buttonID.click();
  }
});

//unblocks everthing when the unblock all button is clicked
unBlock.onclick = function(){
  getBG.disableBlocking(n);

  //clears both local and sync chrome storage systems
  local.clear(function(){
    err = chrome.runtime.lastError;
    if(err){
      alert("An error occured, could not remove item.");
    }
  });
  sync.clear();
  //reloads the extension, closes the popup
  chrome.runtime.reload();
}

$(".unblock-button").click(function(){
  var id = $(this).attr('id');
  var parseId = id.substring(id.length - 1, id.length);
  console.log(parseId);
  getBG.disableBlocking(parseId);
  removeFromList(parseId);

})
//checks whether popup is open or not
if(chrome.extension.getViews({ type: "popup" }) != '[]'){
  tempGetKeys();
  permGetKeys();
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
      for(i = 0; i < allkeys.length; i++){
      var li = document.createElement('li');
      li.setAttribute('id', 'pSite' + i);
      document.getElementById("permbanned").appendChild(li)
      document.getElementById("pSite" + i).innerHTML = allkeys[i];
      }
    });
}
}
