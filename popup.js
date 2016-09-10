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
<<<<<<< HEAD
  if(getBG.makeCookie.getItem('permCounter') != null){
    getPermItems(getBG.makeCookie.getItem('permCounter'));
  }
=======
>>>>>>> V2
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
<<<<<<< HEAD
  }
  if(trimmedURL.indexOf("www.") != -1){
    trimmedURL = trimmedURL.substring(4, url.length);
  }
=======
  }
  if(trimmedURL.indexOf("www.") != -1){
    trimmedURL = trimmedURL.substring(4, url.length);
  }
>>>>>>> V2
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
  var unblockThis = $("#site"+siteID).text();
<<<<<<< HEAD
  if(getBG.extensionDialogs("unblockConfirm", unblockThis)){
    //need to grab key value;
    local.get(unblockThis, function(items){
      chrome.runtime.sendMessage({siteID: items[unblockThis], siteURL: unblockThis, fn: "disableBlocking"});
    });
    $("#" + buttonID).addClass("hide");
    $("#site" + siteID).addClass("hide");
  }

=======

  //need to grab key value;
  local.get(unblockThis, function(items){
    chrome.runtime.sendMessage({siteID: items[unblockThis], siteURL: unblockThis, fn: "disableBlocking"});
  });
  tempGetKeys();
>>>>>>> V2
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
<<<<<<< HEAD
        getBG.makeCounter("inc", "tempCounter");
        var getTempCounter = getBG.makeCookie.getItem('tempCounter');
        console.log(getTempCounter);
        if(getTempCounter < 7){
          chrome.runtime.sendMessage({websiteURL: websiteURL, reason: getReason.value, n: getTempCounter, fn: "enableBlocking"});
          $(".input-field").val('');
        }
        else{
          getBG.extensionDialogs("reachedLimit", websiteURL);
        }
=======

      chrome.runtime.sendMessage({websiteURL: websiteURL, reason: getReason.value, fn: "enableBlocking"});
>>>>>>> V2
    }
    //website will be permablocked
    else if(timeUnitSelected == "5"){
      if(getBG.extensionDialogs("permablock", websiteURL)){
<<<<<<< HEAD
        getBG.makeCounter("inc", "permCounter");
        var getPermCounter = getBG.makeCookie.getItem('permCounter');
        console.log(getPermCounter);
        if(getPermCounter <= 3){
          console.log(websiteURL);
          getBG.permablock(websiteURL);
          getBG.makeCookie.setItem(getPermCounter, websiteURL, Infinity);
          getPermItems(getPermCounter);
          $(".input-field").val('');
=======
        //cookie that stores the number of sites you have added to permaban list
        if(makeCookie.getItem('permCounter') == null){            
        // If the cookie doesn't exist, save the cookie with the value of 1

        //change null to infinity after testing so cookie does not expire. Ask user to enter a password in order to remove permabanned sites 
          makeCookie.setItem('permCounter', '1', Infinity);
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
          makeCookie.setItem('permCounter', permCookieValue, Infinity);
        }

        var getPermCounter = makeCookie.getItem('permCounter');
        if(getPermCounter <= 3){
          getBG.permablock(websiteURL);
          makeCookie.setItem(getPermCounter, websiteURL, Infinity);
          getPermItems(getPermCounter);
>>>>>>> V2
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
<<<<<<< HEAD
        getBG.makeCounter("inc", "tempCounter");
        chrome.runtime.sendMessage({websiteURL: websiteURL, reason: getReason.value, n: getBG.makeCookie.getItem("tempCounter"), unit: timeUnitSelected, t: timeAmount, fn: "enableBlocking"});
        $(".input-field").val('');
=======
        chrome.runtime.sendMessage({websiteURL: websiteURL, reason: getReason.value, unit: timeUnitSelected, t: timeAmount, fn: "enableBlocking"});
>>>>>>> V2
      }
      else{
        getBG.extensionDialogs("invalidTime", timeAmount);
      }
    }
  }
  else{
    getBG.extensionDialogs("invalidURL", websiteURL)
  }
<<<<<<< HEAD
=======
  $(".input-field").val('');
>>>>>>> V2

});

//unblocks everthing when the unblock all button is clicked
$("#unblockAll").click(function(){
  if(getBG.extensionDialogs("unblockAll", "")){
    getBG.unblockAll();
<<<<<<< HEAD

    if(getBG.makeCookie.getItem("tempCounter") != null){
      getBG.makeCookie.removeItem("tempCounter");
    }
=======

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
>>>>>>> V2


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
<<<<<<< HEAD
      getStatus(urlList, len);
    });
}

function getStatus(urlList, length){
  var minKw = "pokusUnblockTimerM";
  var hrKw = "pokusUnblockTimerHr";
  var dKw = "pokusUnblockTimerD";
  var mKw = "pokusNoUnblockTimer";
  for(i = 0; i < length; i++){
    var urlL = urlList[i][0].length;
    var min = urlList[i][0].indexOf(minKw);
    var hr = urlList[i][0].indexOf(hrKw);
    var day = urlList[i][0].indexOf(dKw);
    var manual = urlList[i][0].indexOf(mKw);
    //website blocked for minutes
    if(min != -1){
      var url = urlList[i][0].substring(0, min);
      var time = urlList[i][0].substring(min + minKw.length, urlL);
      console.log(time);
      createList(url.length, url, time + " Mins", i);
    }
    //website blocked for hours;
    else if(hr != -1){
      var url = urlList[i][0].substring(0, hr);
      var time = urlList[i][0].substring(hr + hrKw.length, urlL);
      console.log(time);
      createList(url.length, url, time + " Hrs", i);
    }
    //website blocked for days
    else if(day != -1){
      var url = urlList[i][0].substring(0, day);
      var time = urlList[i][0].substring(day + dKw.length, urlL);
      createList(url.length, url, time + " Days", i);
    }
    //website blocked indefinitely, user can unblock any time
    else{
      var url = urlList[i][0].substring(0, manual);
      createList(url.length, url, 0, i);
    }
  }
}
function createList(urlLen, url, dur, indx){
  if(dur != 0){
    if(urlLen > 10){
      var part1 = url.substring(0, 10);
      var part2 = url.substring(10, urlList[indx][0].length);
      console.log(part1);
      document.getElementById("site" + indx).innerHTML = part1 + "<a class='showMore'>...</a>";
      $("#unblockTimer-" + indx).text(dur);
      $("#unblockTimer-" + indx).removeClass("hide");
      $("#unblock-" + indx).removeClass("hide");
      $("#unblock-" + indx).addClass("dis");
      $("#unblock-" + indx).prop("disabled", true);
    }
    else{
      document.getElementById("site" + indx).innerHTML = url;
      $("#unblockTimer-" + indx).text(dur);
      $("#unblockTimer-" + indx).removeClass("hide");
      $("#unblock-" + indx).removeClass("hide");
      $("#unblock-" + indx).addClass("dis");
      $("#unblock-" + indx).prop("disabled", true);
=======
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
>>>>>>> V2
    }
  }
  else{
    if(urlLen > 10){
      var part1 = url.substring(0, 10);
      var part2 = url.substring(10, urlList[indx][0].length);
      document.getElementById("site" + indx).innerHTML = part1 + "<a class='showMore'>...</a>";
      $("#unblockTimer-" + indx).text("N/A");
      $("#unblockTimer-" + indx).removeClass("hide");
      $("#unblock-" + indx).removeClass("hide");
    }
    else{
      document.getElementById("site" + indx).innerHTML = url;
      $("#unblockTimer-" + indx).text("N/A");
      $("#unblockTimer-" + indx).removeClass("hide");
      $("#unblock-" + indx).removeClass("hide");
    }    
  }
}
/*
function createList(urlList, listLen){
  console.log(urlList);
  for(i = 0; i < listLen; i++){
    if(urlList[i][0].length > 15){
      var part1 = urlList[i][0].substring(0, 15);
      var part2 = urlList[i][0].substring(15, urlList[i][0].length);
      document.getElementById("site" + i).innerHTML = part1 + "<a class='showMore'>...</a>";
      $("#unblock-" + i).removeClass("hide");
    }
    else{
      document.getElementById("site" + i).innerHTML = (urlList[i][0]);
      $("#unblock-" + i).removeClass("hide");
      console.log(urlList[i][0]);
    }
  }
}
*/

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