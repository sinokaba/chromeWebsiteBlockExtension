$(function() {

    const getBG = chrome.extension.getBackgroundPage(),
        url = document.getElementById("websiteURL");
    const timeUnit = document.getElementById("timeUnits"),
        time = document.getElementById("blockPeriod"),
        getReason = document.getElementById("comment");
    var Data = Array();

    $(".tab-link").each(function() {
        $(this).click(function(e) {
            var temp = e.target.id.split('-');
            var tabID = temp[0];
            $(".tab-link").removeClass("active");
            $(this).addClass("active");
            $(".tabCon").addClass("hide");
            $("#" + tabID).removeClass("hide");
            return false;
        })
    });

    //make input field auto select on start up
    focusInField(url);

    function focusInField(ele) {
        ele.focus();
        ele.select();
    }

    //disables/enables the input field depending depending on option selected
    $("#timeUnits").change(function() {
        checkOpSelected();
    })


    function checkOpSelected() {
        timeUnitSelected = timeUnit.options[timeUnit.selectedIndex].value;
        console.log(timeUnitSelected);
        if (timeUnitSelected == "4" || timeUnitSelected == "5") {
            $("#blockPeriod").prop('disabled', true);
        } else if (timeUnitSelected == "1" || timeUnitSelected == "2" || timeUnitSelected == "3") {
            $("#blockPeriod").prop('disabled', false);
            focusInField(time);
        }
    }
    $("#list-link").click(function() {
        crd.grabList();
    });

    $("#home-link").click(function() {
        $('#timeUnits option').prop('selected', function() {
            console.log(this.defaultSelected);

            return this.defaultSelected;
        });
        checkOpSelected();
        $("#loadList").val("Load List");
        $("#loadedList").addClass("hide");
        $("#websiteURL").removeClass("hide");
        $("#websiteURL").prop("disabled", false);

        //clears input field
        focusInField(url);
        $(".input-field").val('');
    });


    //checks if url exists
    function ValidURL(str) {
        var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
        if (!pattern.test(str)) {
            return false;
        } else {
            return true;
        }
    };

    //checks if entered value is an integer, also tests for if the input value is empty
    function isNum(val) {
        const pattern = new RegExp('^[0-9]+$');
        if (pattern.test(val)) {
            return true;
        } else {
            return false;
        }
    };

    //unblock button, using .on so this function works for newly generated elements
    $("#blockList").on('click', '.unblock-button', function() {
        const buttonID = $(this).attr('id');
        const siteID = buttonID.split('-');
        crd.del(siteID[1]);
    });


    $("#pw").click(function() {
        if (getBG.makeCookie.getItem("pw") != null) {
            console.log(getBG.makeCookie.getItem("pw"));
            if (getBG.extensionDialogs("changePw", "")) {
                var auth = enterPw();
                console.log(auth);
                if (auth == true) {

                    setPw();
                } else if (!auth) {
                    getBG.extensionDialogs("tooManyTries", "");
                }
            }
        } else {
            setPw();
        }
    });


    function setPw() {
        var pass = getBG.extensionDialogs("setPw", "");
        console.log(pass);
        while (pass.length < 4) {
            pass = getBG.extensionDialogs("pwShort", "");
        }
        getBG.makeCookie.setItem("pw", pass, Infinity);
    }


    $("#save").click(function() {
        var urlList = [];
        for (var i = 0; i < Data.length; i++) {
            if (Data[i][3] != "INFN") {
                urlList.push(Data[i][1]);
            }
        }
        var urlListStr = JSON.stringify(urlList);
        console.log(getBG.makeCookie.getItem("savedList"));
        if (getBG.makeCookie.getItem("savedList") == null) {
            getBG.makeCookie.setItem("savedList", urlListStr, Infinity);
            getBG.extensionDialogs("listSaved", "");
        } else {
            if (getBG.extensionDialogs("overrideSave", urlListStr)) {
                getBG.makeCookie.setItem("savedList", urlListStr, Infinity);
            }
        }
        console.log(getBG.makeCookie.getItem("savedList"));
    })


    $("#loadList").click(function() {

        if ($(this).val() == "Load List") {
            if (getBG.makeCookie.getItem("savedList") != null) {
                $(this).val("Unload List");
                $("#loadedList").removeClass("hide");
                $("#websiteURL").addClass("hide");
                $("#websiteURL").prop("disabled", true);
                var temp = JSON.parse(getBG.makeCookie.getItem("savedList"));

                $("#loadedList").text(temp);
            } else {
                getBG.extensionDialogs("noSave", "");
            }
        } else {
            $(this).val("Load List");
            $("#loadedList").addClass("hide");
            $("#websiteURL").removeClass("hide");
            $("#websiteURL").prop("disabled", false);
            $("#loadedList").text("");
        }
    })

    //reworked create/add/delete
    var crd = new function() {
        this.addSite = function() {
            var rsn = getReason.value;
            var timeUnitSelected = timeUnit.options[timeUnit.selectedIndex].value;
            var siteInfo;
            if (!$("#websiteURL").is(":disabled")) {
                var websiteURL = url.value;
                if (ValidURL(websiteURL)) {
                    if (getBG.unique(websiteURL)) {
                        const url = getBG.trim(websiteURL);
                        siteInfo = sendInfo(url, timeUnitSelected, rsn, "single");
                    } else {
                        getBG.extensionDialogs("alreadyBlocked", websiteURL);
                    }
                } else {
                    getBG.extensionDialogs("invalidURL", websiteURL)
                }
                console.log(siteInfo.length);
                if (siteInfo.length > 0) {
                    getBG.addSite(siteInfo);

                }
            } else {
                var ls = $("#loadedList").val().split(',');
                for (var i = 0; i < ls.length; i++) {
                    if (getBG.unique(ls[i])) {
                        siteInfo = sendInfo(ls[i], timeUnitSelected, rsn, "list");
                        getBG.addSite(siteInfo);
                    } else {
                        console.log("site already blocked");
                    }
                }
            }
            this.grabList();
        }

        this.del = function(id) {
            var index = id;
            getBG.removeSite(index, "norm");
            this.grabList();
        }
        this.grabList = function() {
            Data = getBG.Data;
            console.log(Data + " len: " + Data.length);
            var tempOutput = "";
            var permOutput = "";
            const tbl = document.getElementById("blockList");
            const permList = document.getElementById("permablocked");
            var emptyMainList = true;
            $("#save").addClass("hide");
            if (Data.length > 0) {
                for (i = 0; i < Data.length; i++) {
                    const urlInList = Data[i][1];
                    const ubDate = Data[i][3];
                    console.log(ubDate);
                    if (ubDate != "INFN") {
                        emptyMainList = false;
                        tempOutput += "<tr>";
                        tempOutput += "<td class='url' id='site-" + i + "'" + ">" + urlInList + "</td>";
                        tempOutput += "<td id='unblockTimer-" + i + "'" + " class='ubDate'>" + ubDate + "</td>";
                        if (ubDate != "N/A") {
                            tempOutput += "<td><button" + " class='button-style dis' disabled>Remove</button></td>";
                            tempOutput += "</tr>";
                        } else {
                            tempOutput += "<td><button id='unblock-" + i + "'" + " class='button-style unblock-button'>Remove</button></td>";
                            tempOutput += "</tr>";
                        }
                    } else {
                        permOutput += "<li class='url'>" + urlInList + "</li>";
                    }
                }
                if (!emptyMainList) {
                    $("#save").removeClass("hide");
                    //$("#unblockAll").removeClass("hide");
                }
            }
            return [tbl.innerHTML = tempOutput, permList.innerHTML = permOutput];
        }
    }


    /*
    $("#unblockAll").click(function(){
      if(getBG.extensionDialogs("unblockAll")){
        if(enterPw()){

        }
        else{

        }
      }
    })
    */


    function enterPw() {
        var attempts = 0;
        var correct = false;
        console.log(correct);
        while (attempts < 4 && correct == false) {
            console.log(attempts);
            var input = getBG.extensionDialogs("enterPw", "");
            console.log(input);
            if (input === getBG.makeCookie.getItem("pw")) {
                correct = true;
            } else if (input == null) {
                correct = "cancelled";
            } else {
                attempts++;
            }
        }
        return correct;
    }


    function sendInfo(url, unit, rsn, tp) {
        var info = [];
        //website blocked normally, user can unblock anytime
        if (unit == "4") {
            info = ["n", url, rsn, "N/A"];
            $(".input-field").val('');
        }
        //website will be permablocked
        else if (unit == "5") {
            if (getBG.extensionDialogs("permablock", url)) {
                if (getBG.makeCookie.getItem("pw") == null) {
                    info = ["p", url, rsn, "INFN"];
                    $(".input-field").val('');
                } else {
                    var auth = enterPw();
                    if (auth == true) {
                        info = ["p", url, rsn, "INFN"];
                        $(".input-field").val('');
                    } else if (!auth) {
                        getBG.extensionDialogs("tooManyTries", "");
                    }
                }
            }
        } else {
            var timeAmount = time.value;
            console.log(timeAmount);
            if (unit == "1") {
                timeAmount *= 60000;
            } else if (unit == "2") {
                timeAmount *= 3600000;
            } else if (unit == "3") {
                timeAmount *= 86400000;
            }
            //calls isnum function to check whether the user inputted an integer value
            if ((isNum(timeAmount))) {
                var sd = Date.now(),
                    ed = new Date(timeAmount + sd);
                var year = ed.getFullYear(),
                    month = ed.getMonth() + 1,
                    day = ed.getDate(),
                    hr = ed.getHours() % 12,
                    min = ed.getMinutes();
                var period = ed.getHours() > 11 || ed.getHours() == 24 ? "PM" : "AM";
                month = month < 10 ? "0" + month : month;
                day = day < 10 ? "0" + day : day;
                hr = hr < 10 ? "0" + hr : hr;
                min = min < 10 ? "0" + min : min;
                if (hr == 0) {
                    hr = 12;
                }
                var unblockDate = month + "/" + day + "/" + year + " at " + hr + ":" + min + " " + period;
                info = ["n", url, rsn, unblockDate, timeAmount + sd];
                if (tp != "list") {
                    $(".input-field").val('');
                }
            } else {
                getBG.extensionDialogs("invalidTime", timeAmount);
            }
        }
        return info;
    }


    $('#mainForm').submit(function(e) {
        e.preventDefault();
    })

    //listens to the block button, and blocks the website entered into the input field once it's pressed
    $("#blockNow").click(function() {
        crd.addSite();
    });

});