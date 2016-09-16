//will change the dom of the website that's blocked be a blank page with theh reason that the user inputted in large black letters

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
	if(request.banned){
		console.log("this is getting hit");
		chrome.tabs.executeScript({
		    code: 'document.body.style.backgroundColor="red"'
		});	
	}
	else{
		console.log("it didn't get hit");
	}
});
