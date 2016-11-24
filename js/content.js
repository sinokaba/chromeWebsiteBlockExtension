chrome.tabs.getCurrent(function(tab) {
    console.log(tab.id);
    var thisTab = tab.id;
    chrome.storage.local.get(null, function(item) {
        var quotes = $.getJSON('quotes.json', function(data){
            console.log(data);
            var items = [];
            $.each(data, function(key, val){
                items.push(key + " - " + val);
            })
            console.log(items.length);
            var rand = Math.floor(Math.random() * items.length);
            console.log(rand);
            $("#quote").text(items[rand]);
        });
        var url = item[thisTab];
        var Data = chrome.extension.getBackgroundPage().Data;
        var msg = "No reason specified";
        for (var i = 0; i < Data.length; i++) {
            if (url.indexOf(Data[i][1]) != -1) {
                if (Data[i][2] != "") {
                    msg = Data[i][2];
                }
                url = Data[i][1];
            }
            console.log(url);
        }
        $("#url").text(url);
        $("#res").text(msg);
    });
});
