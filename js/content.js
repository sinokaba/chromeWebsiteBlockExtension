chrome.tabs.getCurrent(function(tab){
	console.log(tab.id);
	var thisTab = tab.id;
	chrome.storage.local.get(null, function (item) {
	  var url = item[thisTab];
	  var Data = chrome.extension.getBackgroundPage().Data;
	  var msg = "No reason specified";
	  for(var i = 0; i < Data.length; i++){
	  	if(url.indexOf(Data[i][1]) != -1 && Data[i][2] != ""){
	  		url = Data[i][1];
	  		msg = Data[i][2];
	  	}
	  }
	  $("#url").text(url);
	  $("#res").text(msg);
	});
});