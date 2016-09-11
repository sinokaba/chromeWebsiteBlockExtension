window.onload = function(){
//all the global vars i'm using
var obj = {};
var local = chrome.storage.local;
var website;
var getBG = chrome.extension.getBackgroundPage();
var err = chrome.runtime.lastError;
var url = document.getElementById("websiteURL");
var getReason = document.getElementById("comment");
var timeUnit = document.getElementById("timeUnits");
var time = document.getElementById("blockPeriod");
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

$("#timeUnits").click(function(){
  timeUnitSelected = timeUnit.options[timeUnit.selectedIndex].value;
  console.log(timeUnitSelected);
  if(timeUnitSelected == "4" || timeUnitSelected == "5"){
    $("#blockPeriod").prop('disabled', true);
  }else{
    $("#blockPeriod").prop('disabled', false);
  }
});

$("#list-link").click(function(){
  tempGetKeys();
  if(getBG.makeCookie.getItem('permCounter') != null){
    getPermItems(getBG.makeCookie.getItem('permCounter'));
  }
});

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
  if(trimmedURL.indexOf("www.") != -1){
    trimmedURL = trimmedURL.substring(4, url.length);
  }
  return trimmedURL;
}

//checks if entered value is an integer, also tests for if the input value is empty
function isNum(val){
  var pattern = new RegExp('^[0-9]+$');
  if(pattern.test(val)){
    return true;
  }
  else{
    return false;
  }
}


$(".unblock-button").click(function(){
  var buttonID = $(this).attr('id');
  var siteID = buttonID.substring(buttonID.length - 1, buttonID.length);
  var unblockThis = $("#site" + siteID).text();
  var timerText = $("#unblockTimer" + siteID).text();
  if(getBG.extensionDialogs("unblockConfirm", unblockThis)){
    //need to grab key value;
    if(timerText == "N/A"){
      local.get(unblockThis, function(items){
        console.log(items[unblockThis]);
        chrome.runtime.sendMessage({siteID: items[unblockThis + "pokusNoUnblockTimer"], siteURL: unblockThis, fn: "disableBlocking"});
      });      
    }
    else if(timerText.substring(timerText.length - 1, timerText.length) == "m"){
      local.get(unblockThis, function(items){
        console.log(items[unblockThis]);
        chrome.runtime.sendMessage({siteID: items[unblockThis + "pokusUnblockTimerM" + timerText], siteURL: unblockThis, fn: "disableBlocking"});
      });
    }
    local.get(unblockThis, function(items){
      console.log(items[unblockThis]);
      chrome.runtime.sendMessage({siteID: items[unblockThis], siteURL: unblockThis, fn: "disableBlocking"});
    });
    $("#" + buttonID).addClass("hide");
    $("#site" + siteID).addClass("hide");
  }
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
  timeUnitSelected = timeUnit.options[timeUnit.selectedIndex].value;
  if(ValidURL(websiteURL)){
    websiteURL = trimURL(websiteURL);
    //website blocked normally, user can unblock anytime
    if(timeUnitSelected == "4"){
        getBG.makeCounter("inc", "tempCounter");
        var getTempCounter = getBG.makeCookie.getItem('tempCounter');
        console.log("tempcounter: " + getTempCounter);
        if(getTempCounter < 7){
          chrome.runtime.sendMessage({websiteURL: websiteURL, reason: getReason.value, n: getTempCounter, fn: "enableBlocking"});
          $(".input-field").val('');
        }
        else{
          getBG.extensionDialogs("reachedLimit", websiteURL);
        }
    }
    //website will be permablocked
    else if(timeUnitSelected == "5"){
      if(getBG.extensionDialogs("permablock", websiteURL)){
        getBG.makeCounter("inc", "permCounter");
        var getPermCounter = getBG.makeCookie.getItem('permCounter');
        console.log(getPermCounter);
        if(getPermCounter <= 3){
          console.log(websiteURL);
          getBG.permablock(websiteURL);
          getBG.makeCookie.setItem(getPermCounter, websiteURL, Infinity);
          getPermItems(getPermCounter);
          $(".input-field").val('');
        }
        else{
          getBG.extensionDialogs("reachedLimit", websiteURL);
        }
      }
    }
    else{
      timeAmount = time.value;
      //calls isnum function to check whether the user inputted an integer value
      if((isNum(timeAmount))){
        getBG.makeCounter("inc", "tempCounter");
        chrome.runtime.sendMessage({websiteURL: websiteURL, reason: getReason.value, n: getBG.makeCookie.getItem("tempCounter"), unit: timeUnitSelected, t: timeAmount, fn: "enableBlocking"});
        $(".input-field").val('');
      }
      else{
        getBG.extensionDialogs("invalidTime", timeAmount);
      }
    }
  }
  else{
    getBG.extensionDialogs("invalidURL", websiteURL)
  }
  $(".input-field").val('');
});

//unblocks everthing when the unblock all button is clicked
$("#unblockAll").click(function(){
  if(getBG.extensionDialogs("unblockAll", "")){
    getBG.unblockAll();

    if(getBG.makeCookie.getItem("tempCounter") != null){
      getBG.makeCookie.removeItem("tempCounter");
    }
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

//grabbing the keys and their values
function tempGetKeys(){
  console.log("you called meee");
    local.get(null, function(items){
      var allkeys = Object.keys(items);
      var len = allkeys.length;
      console.log(len);

      //sort list based on the date they were added
      if(len > 0){
        for(urlList = []; urlList.length < len; urlList.push([]));
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
    if(getBG.makeCookie.getItem("tempCounter" + urlList[i][1]) != "N/A"){
      if(listLen > 10){
        var part1 = urlList[i][0].substring(0, 20);
        var part2 = urlList[i][0].substring(20, urlList[i][0].length);
        document.getElementById("site" + i).innerHTML = part1 + "<a class='showMore'>...</a>";
        $("#unblockTimer-" + i).removeClass("hide");
        console.log(getBG.makeCookie.getItem("tempCounter" + i.toString()));
        $("#unblockTimer-" + i).text(getBG.makeCookie.getItem("tempCounter" + urlList[i][1]));
        $("#unblock-" + i).removeClass("hide");
        $("#unblock-" + i).addClass("dis");
        $("#unblock-" + i).prop("disabled", true);
      }
      else{
        document.getElementById("site" + i).innerHTML = urlList[i][0];
        $("#unblockTimer-" + i).removeClass("hide");
        console.log(getBG.makeCookie.getItem("tempCounter" + i.toString()));
        $("#unblockTimer-" + i).text(getBG.makeCookie.getItem("tempCounter" + urlList[i][1]));
        $("#unblock-" + i).removeClass("hide");
        $("#unblock-" + i).addClass("dis");
        $("#unblock-" + i).prop("disabled", true);
      }      
    }
    else{
      if(listLen > 10){
        var part1 = urlList[i][0].substring(0, 20);
        var part2 = urlList[i][0].substring(20, urlList[i][0].length);
        document.getElementById("site" + i).innerHTML = part1 + "<a class='showMore'>...</a>";
        $("#unblockTimer-" + i).removeClass("hide");
        console.log(getBG.makeCookie.getItem("tempCounter" + i.toString()));
        $("#unblockTimer-" + i).text(getBG.makeCookie.getItem("tempCounter" + urlList[i][1]));
        $("#unblock-" + i).removeClass("hide");
      }
      else{
        document.getElementById("site" + i).innerHTML = urlList[i][0];
        $("#unblockTimer-" + i).removeClass("hide");
        console.log(getBG.makeCookie.getItem("tempCounter" + i.toString()));
        $("#unblockTimer-" + i).text(getBG.makeCookie.getItem("tempCounter" + urlList[i][1]));
        $("#unblock-" + i).removeClass("hide");
      }
    }
  }
};


$(".more").click(function(){
    $(this).text("less..").siblings(".complete").show();    
}, function(){
    $(this).text("more..").siblings(".complete").hide();    
});

//so the list of perma blocked sites doesn't dissappear after the popup is closed and reopened

function getPermItems(n){
  for(i = 0; i <= n; i++){
    console.log(getBG.makeCookie.getItem(i.toString()));
    $("#perm" + i).text(getBG.makeCookie.getItem(i.toString()));
    $("#permStat" + i).removeClass("hide");
  }
}

//remove after finished with testing
function clearCookies(){
  if(getBG.makeCookie.getItem("permCounter") != null){
    getBG.makeCookie.removeItem("permCounter");
  }
  var items = document.cookie.split(';');
  for(i = 0; i < getBG.makeCookie.keys().length; i++){
    var key2 = items[i].split('=');
    console.log("length: " + getBG.makeCookie.keys().length + "items: " + key2[0]);
    getBG.makeCookie.removeItem(key2[0]);
  }
}

}