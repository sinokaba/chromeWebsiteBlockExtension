window.onload = function(){

var obj = {};
var storage = chrome.storage.local;
var website;
var getBG = chrome.extension.getBackgroundPage();
var err;
var sitesBlocked = -1;
var textbox = document.getElementById("blockSite");
var n = -1;
function block(n){
  website = textbox.value;
  console.log(website);
  getBG.enableBlocking(website);
  
  if(website != ""){
    sitesBlocked = n;
    setKeys();
    addtoList(website.length + 2); 
  }
  else{
    alert("You did not enter a valid website!");
  }
}

textbox.addEventListener("keydown", function(event) {
  if (event.keyCode == 13) {
    n++;
    block(n);
  }
})

document.getElementById("blockNow").onclick = function(){
  n++;
  block(n);
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
  chrome.runtime.reload();
}

if(chrome.extension.getViews({ type: "popup" }) != '[]'){
  getKeys();

}

function getKeys(){
  storage.get(null, function(items){
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


function addtoList(len){
  storage.get(website, function(result){
    var res = JSON.stringify(result).substring(2, len);
    var li = document.createElement('li');
    li.setAttribute('id', 'site' + sitesBlocked);
    document.getElementById("blockList").appendChild(li)
    document.getElementById("site" + sitesBlocked).innerHTML = res;
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
