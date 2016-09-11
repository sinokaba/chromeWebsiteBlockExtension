chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
  if(request.act == "getUnblockDate"){
    if(request.unblockDate == 'na'){
      document.getElementById("unblockTimer-" + request.sId).innerHTML = "N/A";
    }
    else{
      document.getElementById("unblockTimer-" + request.sId).innerHTML  = request.unblockDate;
    }
  }
  else{
    console.log("not workong eh?" + " request: " + request.act);
  }
});
document.getElementById("unblockTimer-0").innerHTML = "ok";

function changeBlockedSite(){
  chrome.tabs.insertCSS(null, {file:"inject.css"})
}