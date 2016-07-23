window.onload = function(){

var obj = {};
var storage = chrome.storage.local;
var website;

document.getElementById("blockNow").onclick = function(){
  website = document.getElementById("blockSite").value;
  console.log(website);
  chrome.extension.getBackgroundPage().enableBlocking(website);
  
  document.getElementById("unblockNow").value = "Unblock " + website;

  obj[website] = website;
  storage.set(obj, function(){
     if (chrome.extension.lastError) {
            alert('An error occurred: ' + chrome.extension.lastError.message);
        }
  });

  storage.get(website, function(result){
    document.getElementById("firstSite").innerHTML = JSON.stringify(result);
  });
}
document.getElementById("unblockNow").onclick = function(){
  chrome.extension.getBackgroundPage().disableBlocking(website);
}
var url = document.getElementById("blockSite");
url.focus();
}

