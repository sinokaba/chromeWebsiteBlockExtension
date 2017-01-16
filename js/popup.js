$(function() {
    const getBG = chrome.extension.getBackgroundPage(),
        url = document.getElementById("websiteURL");
    const timeUnit = document.getElementById("timeUnits"),
        time = document.getElementById("blockPeriod"),
        getReason = document.getElementById("comment");
    var Data = Array();

    $('#mainForm').submit(function(e) {
        e.preventDefault();
    })

    //listens to the block button, and blocks the website entered into the input field once it's pressed
    $("#blockNow").click(function() {
        block();
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

    $("#list-link").click(function() {
        grabList();
    });

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

    function checkOpSelected() {
        timeUnitSelected = timeUnit.options[timeUnit.selectedIndex].value;
        if (timeUnitSelected == "4" || timeUnitSelected == "5") {
            $("#blockPeriod").prop('disabled', true);
        } else if (timeUnitSelected == "1" || timeUnitSelected == "2" || timeUnitSelected == "3") {
            $("#blockPeriod").prop('disabled', false);
            focusInField(time);
        }
    }

    $("#home-link").click(function() {
        $('#timeUnits option').prop('selected', function() {

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
        return /^(http|https|ftp):\/\/[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i.test("http://" + str);
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
        unblock(siteID[1]);
    });


    //set or change password
    $("#pw").click(function() {
        if (getBG.makeCookie.getItem("pw") == null) {
            getBG.setPW();
        } else {
            if (getBG.extensionDialogs("changePw", "")) {
                if (handlePasswordAttempts()) {
                    getBG.setPW();
                }
            }
        }
    });


    $("#save").click(function() {
        if (handlePasswordAttempts()) {
            saveList();
        }
    });

    function saveList() {
        var urlList = [];
        for (var i = 0; i < Data.length; i++) {
            if (Data[i][3] != "INFN") {
                urlList.push(Data[i][1]);
            }
        }
        var urlListStr = JSON.stringify(urlList);
        if (getBG.makeCookie.getItem("savedList") == null) {
            getBG.makeCookie.setItem("savedList", urlListStr, Infinity);
            getBG.extensionDialogs("listSaved", "");
        } else {
            if (getBG.extensionDialogs("overrideSave", urlListStr)) {
                getBG.makeCookie.setItem("savedList", urlListStr, Infinity);
            }
        }
    }
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
    function block() {
        var rsn = getReason.value;
        var timeUnitSelected = timeUnit.options[timeUnit.selectedIndex].value;
        var siteInfo;
        if (!$("#websiteURL").is(":disabled")) {
            var websiteURL = url.value;
            console.log(ValidURL(websiteURL));
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
            if (siteInfo.length > 0) {
                getBG.addSite(siteInfo);

            }
        } else {
            var ls = $("#loadedList").val().split(',');
            for (var i = 0; i < ls.length; i++) {
                if (getBG.unique(ls[i])) {
                    siteInfo = sendInfo(ls[i], timeUnitSelected, rsn, "list");
                    getBG.addSite(siteInfo);
                } else {}
            }
        }
        grabList();
    }


    function unblock(id) {
        var index = id;
        getBG.removeSite(index, "norm");
        grabList();
    }


    function grabList() {
        Data = getBG.Data;
        var tempOutput = "";
        var permOutput = "";
        const tbl = document.getElementById("blockList");
        const permList = document.getElementById("permablocked");
        var emptyMainList = true;
        $("#save").addClass("hide");
        $("#unblockAll").addClass("hide");
        if (Data.length > 0) {
            for (i = 0; i < Data.length; i++) {
                const urlInList = Data[i][1];
                const ubDate = Data[i][3];
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
                $("#unblockAll").removeClass("hide");
            }
        }
        return [tbl.innerHTML = tempOutput, permList.innerHTML = permOutput];
    }



    $("#unblockAll").click(function() {
        if (getBG.extensionDialogs("unblockAll")) {
            if (handlePasswordAttempts()) {
                getBG.unblockAll();
                grabList();
            }
        }
    })

    function handlePasswordAttempts() {
        var success = false;
        if (getBG.makeCookie.getItem("pw") != null) {
            console.log(getBG.makeCookie.getItem("pw"));
            if (getBG.makeCookie.getItem("failedPWAttemps") == null) {
                var auth = getBG.enterPW();
                if (auth == true) {
                    success = true;
                } else if (!auth) {
                    getBG.failedPW();
                } else {
                    console.log("Cancelled!");
                }
            } else {
                getBG.failedPW();
            }
        } else {
            success = true;
        }
        return success;
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
                if (handlePasswordAttempts()) {
                    info = ["p", url, rsn, "INFN"];
                    $(".input-field").val('');
                }
            }
        } else {

            var t = determineBlockTime(unit);

            //calls isnum function to check whether the user inputted an integer value
            if ((isNum(t))) {
                var startDate = Date.now();
                var unblockDate = formatUnblockDate(t, startDate);
                info = ["n", url, rsn, unblockDate, t + startDate];
                if (tp != "list") {
                    $(".input-field").val('');
                }
            } else {
                getBG.extensionDialogs("invalidTime", t);
            }
        }
        return info;
    }

    function determineBlockTime(unit) {
        var timeAmount = time.value;

        if (unit == "1") {
            timeAmount *= 60000;
        } else if (unit == "2") {
            timeAmount *= 3600000;
        } else if (unit == "3") {
            timeAmount *= 86400000;
        }

        return timeAmount;
    }

    function formatUnblockDate(banLength, start) {
        var end = new Date(banLength + start);
        var year = end.getFullYear(),
            month = end.getMonth() + 1,
            day = end.getDate(),
            hr = end.getHours() % 12,
            min = end.getMinutes();
        var period = end.getHours() > 11 || end.getHours() == 24 ? "PM" : "AM";
        month = month < 10 ? "0" + month : month;
        day = day < 10 ? "0" + day : day;
        hr = hr < 10 ? "0" + hr : hr;
        min = min < 10 ? "0" + min : min;
        if (hr == 0) {
            hr = 12;
        }
        return month + "/" + day + "/" + year + " at " + hr + ":" + min + " " + period;
    }

});