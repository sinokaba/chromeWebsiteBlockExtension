$(function() {
//all the global vars i'm using
var obj = {};
var local = chrome.storage.local;
var website;
var getBG = chrome.extension.getBackgroundPage();
var url = document.getElementById("websiteURL");
var getReason = document.getElementById("comment");
var timeUnit = document.getElementById("timeUnits");
var time = document.getElementById("blockPeriod");
var reason;
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
});

//make input field auto select on start up
focusInField(url);

function focusInField(ele){
  ele.focus();
  ele.select();
}

//disables/enables the input field depending depending on option selected
$("#timeUnits").change(function(){
  timeUnitSelected = timeUnit.options[timeUnit.selectedIndex].value;
  console.log(timeUnitSelected);
  if(timeUnitSelected == "4" || timeUnitSelected == "5"){
    $("#blockPeriod").prop('disabled', true);
  }
  else if(timeUnitSelected == "1" || timeUnitSelected == "2" || timeUnitSelected == "3"){
    $("#blockPeriod").prop('disabled', false);
    focusInField(time);
  }
})


$("#list-link").click(function(){
  crd.grabList();
  if(getBG.makeCookie.getItem('permCounter') != null){
    getPermItems(getBG.makeCookie.getItem('permCounter'));
  }
});

$("#home-link").click(function(){
  //clears input field
  focusInField(url);
  $(".input-field").val('');
});
//disable enter key cause it causes a ton of unforseen bugs


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
};

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
};

//checks if entered value is an integer, also tests for if the input value is empty
function isNum(val){
  var pattern = new RegExp('^[0-9]+$');
  if(pattern.test(val)){
    return true;
  }
  else{
    return false;
  }
};

//unblock button, using .on so this function works for newly generated elements
$("#blockList").on('click', '.unblock-button', function(){
  var buttonID = $(this).attr('id');
  var siteID = buttonID.split('-');
  crd.del(siteID[1]);
});

$("#blockAll").click(function(){
  if(getBG.extensionDialogs("blockAll", "")){
    getBG.blockAllWebsites();
  }
});

//reworked create/add/delete
var crd = new function(){
  var Data = Array();
  this.addSite = function(){
    var repeat = false;
    var websiteURL = url.value;
    var rsn = getReason.value;
    var timeUnitSelected = timeUnit.options[timeUnit.selectedIndex].value;
    var siteInfo = [];
    if(ValidURL(websiteURL)){
      for(var j = 0; j < Data.length; j++){
        if(websiteURL == Data[j][1]){
          repeat = true;
        }
      }
      if(!repeat){
        websiteURL = trimURL(websiteURL);
        //website blocked normally, user can unblock anytime
        if(timeUnitSelected == "4"){
          siteInfo = ["n", websiteURL, rsn, "N/A"];
          $(".input-field").val('');
        }
        //website will be permablocked
        else if(timeUnitSelected == "5"){
          if(getBG.extensionDialogs("permablock", websiteURL)){
            siteInfo = ["p", websiteURL, rsn, "INFN"];
            $(".input-field").val('');
          }
        }
        else{
          var timeAmount = time.value;
          if(timeUnitSelected == "1"){
            timeAmount *= 60000;
          }
          else if(timeUnitSelected == "2"){
            timeAmount *= 3600000;
          }
          else if(timeUnitSelected == "3"){
            timeAmount *= 86400000;
          }
          //calls isnum function to check whether the user inputted an integer value
          if((isNum(timeAmount))){
            var sd = Date.now(), ed = new Date(timeAmount + sd);
            var year = ed.getFullYear(), month = ed.getMonth() + 1, day = ed.getDate(), hr = ed.getHours() % 12, min = ed.getMinutes();
            var period = ed.getHours() > 11 || ed.getHours() == 24 ? "PM" : "AM";
            month = month < 10 ? "0" + month : month;
            day = day < 10 ? "0" + day : day;
            hr = hr < 10 ? "0" + hr : hr;
            min = min < 10 ? "0" + min : min;
            if(hr == 0){
              hr = 12;
            }
            var unblockDate = month + "/" + day + "/" + year + " at " + hr + ":" + min + " " + period;
            getBG.makeCounter("inc", "tempCounter");
            var siteId = getBG.makeCookie.getItem('tempCounter');
            siteInfo = ["n", websiteURL, rsn, unblockDate, timeAmount + sd];
            $(".input-field").val('');
          }
          else{
            getBG.extensionDialogs("invalidTime", timeAmount);
          }
        }
      }
      else{
        getBG.extensionDialogs("alreadyBlocked", websiteURL);
      }
    }
    else{
      getBG.extensionDialogs("invalidURL", websiteURL)
    }
    console.log(siteInfo.length);
    if(siteInfo.length > 0){
      getBG.addSite(siteInfo);
    }
    this.grabList();
  }
  this.del = function(id){
    var index = id;
    getBG.removeSite(index, "n");
    this.grabList();
  }
  this.grabList = function(){
    Data = getBG.Data;
    console.log(Data + " len: " + Data.length);
    var tempOutput = "";
    var permOutput = "";
    var tbl = document.getElementById("blockList");
    var permList = document.getElementById("permablocked");
    $("#store").addClass("hide");
    $("#unblockAll").addClass("hide");
    if(Data.length > 0){
      $("#store").removeClass("hide");
      $("#unblockAll").removeClass("hide");      
      for(i = 0; i < Data.length; i++){
        var url = Data[i][1];
        var ubDate = Data[i][3];
        console.log(ubDate);
        if(ubDate != "INFN"){
          tempOutput += "<tr>";
          tempOutput += "<td id='site-" + i + "'" + ">" + url + "</td>";
          tempOutput += "<td id='unblockTimer-" + i + "'" + " class='ubDate'>" + ubDate +"</td>";
          if(ubDate != "N/A"){
            tempOutput += "<td><button" + " class='button-style dis' disabled>Remove</button></td>";
            tempOutput += "</tr>";
          }
          else{
            tempOutput += "<td><button id='unblock-" + i + "'" + " class='button-style unblock-button'>Remove</button></td>";
            tempOutput += "</tr>";
          }
        }
        else{
          permOutput += "<li>" + url + "</li>";
        }
      }
    }
    return [tbl.innerHTML = tempOutput, permList.innerHTML = permOutput];
  }
}


$('#mainForm').submit(function(e){
  e.preventDefault();
})

//listens to the block button, and blocks the website entered into the input field once it's pressed
$("#blockNow").click(function(){
  crd.addSite();
});

//unblocks everthing when the unblock all button is clicked
$("#unblockAll").click(function(){
  if(getBG.extensionDialogs("unblockAll", "")){
    getBG.unblockAll();

    if(getBG.makeCookie.getItem("Counter") != null){
      getBG.makeCookie.removeItem("Counter");
    }
    //remove after testing
    clearCookies();
    crd.grabList();
  }
});

function getPermItems(n){
  for(i = 0; i <= n; i++){
    console.log(getBG.makeCookie.getItem(i.toString()));
    $("#perm" + i).text(getBG.makeCookie.getItem(i.toString()));
  }
};


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

});
