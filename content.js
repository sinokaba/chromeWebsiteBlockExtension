//will change the dom of the website that's blocked be a blank page with theh reason that the user inputted in large black letters


function changeBlockedSite(){
  chrome.tabs.insertCSS(null, {file:"inject.css"})
}