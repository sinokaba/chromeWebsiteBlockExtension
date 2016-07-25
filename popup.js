window.onload = function(){

var obj = {};
var storage = chrome.storage.local;
var website;
var getBG = chrome.extension.getBackgroundPage();
var err;
var sitesBlocked = 0;
document.getElementById("blockNow").onclick = function(){
  website = document.getElementById("blockSite").value;
  console.log(website);
  getBG.enableBlocking(website);
  
  setKeys();

  getKeys(); 

  sitesBlocked++;
}

document.getElementById("unblockNow").value = "Unblock All";



document.getElementById("unblockNow").onclick = function(){
  getBG.disableBlocking(website);
  storage.clear(function(){
    err = chrome.runtime.lastError;
    if(err){
      alert("An error occured, could not remove item.");
    }
  }); 
}
getKeys();
function getKeys(){
  storage.get(null, function(items){
    var allkeys = Object.keys(items);
    console.log(allkeys);
    for(i = 0; i < allkeys.length; i++){
      document.getElementById("p" + i).innerHTML = allkeys[i];
      console.log(allkeys[allkeys.length - i]);
    }
  });
}

function setKeys(){
  obj[website] = website;
  storage.set(obj, function(){
     if (chrome.extension.lastError) {
            alert('An error occurred: ' + chrome.extension.lastError.message);
        }
  });
}
var url = document.getElementById("blockSite");
url.focus();
}

