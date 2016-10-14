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
$("#timeUnits").click(function(){
  disableTField();
});

function disableTField(){
  timeUnitSelected = timeUnit.options[timeUnit.selectedIndex].value;
  console.log(timeUnitSelected);
  if(timeUnitSelected == "4" || timeUnitSelected == "5"){
    $("#blockPeriod").prop('disabled', true);
  }else{
    $("#blockPeriod").prop('disabled', false);
  }
};

disableTField();

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
  /*
  var unblockThis = $("#site-" + siteID[1]).text();
  console.log(unblockThis);
  var timerText = $("#unblockTimer-" + siteID).text();
  if(getBG.extensionDialogs("unblockConfirm", unblockThis)){
    //need to grab key value;
    local.get(unblockThis, function(items){
      console.log(items[unblockThis]);
      chrome.runtime.sendMessage({siteID: items[unblockThis], siteURL: unblockThis, fn: "disableBlocking"});
    });
    $("#row-" + siteID).addClass("hide");
  }
  tempGetKeys();
});

$("#blockAll").click(function(){
  if(getBG.extensionDialogs("blockAll", "")){
    getBG.blockAllWebsites();
  }
  */
});




//reworked create/add/delete
var crd = new function(){
  var Data = Array();
  this.addSite = function(){
    var websiteURL = url.value;
    var rsn = getReason.value;
    var timeUnitSelected = timeUnit.options[timeUnit.selectedIndex].value;
    var siteInfo = [];
    if(ValidURL(websiteURL)){
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
          siteInfo = ["n", websiteURL, rsn, unblockDate];
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
    getBG.testStoring(siteInfo);
  }
  this.del = function(id){
    var index = id;
    console.log(index);
    Data.splice(index, 1);
    console.log(Data);
    this.grabList();
  }
  this.updateList = function(){
    /*
    local.get("data", function(result){
      var rawD = Object.keys(result).map(function (key){ 
        return result[key]; 
      });
      if(rawD.length >= 1){
        len = rawD[0].match((/\[/g) || []).length - 1; 

        var temp = rawD[0].replace(/['"]+/g, '');
        var tempParsed = temp.split(']');
        console.log(len);
        for(var  i = 0; i < len; i++){
          var d = tempParsed[i].split('[');
          console.log(d);
          if(i == 0){
            Data.push(d[2]);
          }
          else{
            Data.push(d[1]);
          }
        }
        console.log(Data);
      }
    });
    */
  }
  this.grabList = function(){
    Data = getBG.Data;
    console.log(Data + " len: " + Data.length);
    var output = "";
    var tbl = document.getElementById("blockList");
    if(Data.length > 0){
        for(i = 0; i < Data.length; i++){
          var url = Data[i][1];
          var ubDate = Data[i][3];
          if(ubDate != "N/A"){
            output += "<tr>";
            output += "<td id='site-" + i + "'" + ">" + url + "</td>";
            output += "<td id='unblockTimer-" + i + "'" + " class='ubDate'>" + ubDate +"</td>";
            output += "<td><button id='unblock-" + i + "'" + " class='button-style unblock-button dis' disabled>Remove</button></td>";
            output += "</tr>";
          }
          else{
            output += "<tr>";
            output += "<td id='site-" + i + "'" + ">" + url; + "</td>";
            output += "<td id='unblockTimer-" + i + "'" + " class='ubDate'>" + ubDate +"</td>";
            output += "<td><button id='unblock-" + i + "'" + " class='button-style unblock-button'>Remove</button></td>";
            output += "</tr>";
          }
        }
      }
    return tbl.innerHTML = output;
  }
}
crd.updateList();


$('#mainForm').submit(function(e){
  e.preventDefault();
})


function sendSiteInfo(num, url, res, unt, time){
  var dup = 0;
  var siteIndex = num;
  var tries = 0;
  if(num == 7 && tries == 0){
    num = 0;
    tries++;
  }
  console.log("checkUnique function test: " + num);
  local.get(null, function(items){
    var allkeys = Object.keys(items);
    var len = allkeys.length;
    console.log(allkeys);
    if(len != 0){
      if(items[allkeys[0]] == 0){
        for(var i = 0; i < len; i++){
          if(num == items[allkeys[i]]){
            dup++;
            console.log("number of duplicates: " + dup);
          }
        }
      }
      if(dup != 0){
        sendSiteInfo(num++, url, res, unt, time);
      }
    }
    console.log("siteIndex : " + siteIndex);
    chrome.runtime.sendMessage({websiteURL: url, reason: res, n: siteIndex, unit: unt, t: time, fn: "enableBlocking"});
  })
}

//listens to the block button, and blocks the website entered into the input field once it's pressed
$("#blockNow").click(function(){
  crd.addSite();
  /*
  $('tr', 'th').css('padding-right', '20px');
  websiteURL = url.value;
  var re = getReason.value;
  timeUnitSelected = timeUnit.options[timeUnit.selectedIndex].value;
  if(ValidURL(websiteURL)){
    websiteURL = trimURL(websiteURL);
    //website blocked normally, user can unblock anytime
    if(timeUnitSelected == "4"){
        getBG.makeCounter("inc", "tempCounter");
        var getTempCounter = getBG.makeCookie.getItem('tempCounter');
        console.log("tempcounter: " + getTempCounter);
        if(getTempCounter < 8){
          sendSiteInfo(getTempCounter, websiteURL, re, timeUnitSelected, "na");
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
        getTempCounter = getBG.makeCookie.getItem('tempCounter');
        if(getTempCounter < 8){
          console.log("tempcounter: " + getTempCounter);        
          sendSiteInfo(getTempCounter, websiteURL, re, timeUnitSelected, timeAmount);
          $(".input-field").val('');
        }
      }
      else{
        getBG.extensionDialogs("invalidTime", timeAmount);
      }
    }
  }
  else{
    getBG.extensionDialogs("invalidURL", websiteURL)
  }
  tempGetKeys();
  return false;
  */
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
    chrome.runtime.sendMessage({fn: "clearStorage"});
  }
  location.reload();
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
        for (i = 0; i < len; i++){
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

        createList(urlList, len);
      }
      //call createlist function so the list of block sites will show up in the popup
    });
};

/*
function createList(urlList, listLen){
  var tbl = document.getElementById("blockList");
  var output = "";
  for(var i = 0; i < listLen; i++){
    var unblockDate = getBG.makeCookie.getItem("tempCounter" + urlList[i][1]);
    var row = document.createElement("tr");
    var urlCell = document.createElement("td");
    var dateCell = document.createElement("td");
    var btnCell = document.createElement("td");
    var btn = document.createElement("button");
    urlCell.setAttribute("id", "site-" + i);
    urlCell.innerHTML = urlList[i][0];
    dateCell.setAttribute("id", "unblockTimer-" + i);
    dateCell.innerHTML = unblockDate;
    dateCell.className = "ubDate";

    btn.setAttribute("id", "unblock-" + i);
    btn.innerHTML = "Remove";
    btn.className = "button-style unblock-button";

    if(unblockDate != "N/A"){
      btn.className += "dis";
      btn.disabled = true;
    }
    btnCell.appendChild(btn);
    row.appendChild(urlCell);
    row.appendChild(dateCell);
    row.appendChild(btnCell);

    tbl.appendChild(row);
  }
};

*/
function createList(urlList, listLen){
  var tbl = document.getElementById("blockList");
  var output = "";
  for(i = 0; i < listLen; i++){
    var unblockDate = getBG.makeCookie.getItem("tempCounter" + urlList[i][1]);
    console.log(unblockDate);
    if(unblockDate != "N/A"){
      output += "<tr>";
      output += "<td id='site-" + i + "'" + ">" + urlList[i][0]; + "</td>";
      output += "<td id='unblockTimer-" + i + "'" + " class='ubDate'>" + unblockDate +"</td>";
      output += "<td><button id='unblock-" + i + "'" + " class='button-style unblock-button dis' disabled>Remove</button></td>";
      output += "</tr>";
    }
    else{
      output += "<tr>";
      output += "<td id='site-" + i + "'" + ">" + urlList[i][0]; + "</td>";
      output += "<td id='unblockTimer-" + i + "'" + " class='ubDate'>" + unblockDate +"</td>";
      output += "<td><button id='unblock-" + i + "'" + " class='button-style unblock-button'>Remove</button></td>";
      output += "</tr>";
    }
  }
  return tbl.innerHTML = output;
};

$(".showMore").click(function(){
    $(this).text("less..").siblings(".complete").show();    
}, function(){
    $(this).text("more..").siblings(".complete").hide();    
});

//so the list of perma blocked sites doesn't dissappear after the popup is closed and reopened

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