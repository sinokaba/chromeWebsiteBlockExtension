function cancel(requestDetails) {
  console.log("Canceling: " + requestDetails.url + ". Get back to work!");
  return {cancel: true};
}

chrome.webRequest.onBeforeRequest.addListener(
  cancel,
    {urls: ["*://www.reddit.com/*"]},
    ["blocking"]);