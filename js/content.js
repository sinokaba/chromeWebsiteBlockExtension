chrome.tabs.getCurrent(function(tab) {
    var thisTab = tab.id;
    chrome.storage.local.get(null, function(item) {
        var quotes = $.getJSON('quotes.json', function(data){
            var items = [];
            $.each(data, function(key, val){
                items.push(key + " - " + val);
            })
            var rand = Math.floor(Math.random() * items.length);
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
        }
        $("#url").text(url);
        $("#res").text(msg);
    });
});
