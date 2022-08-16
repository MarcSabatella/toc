
chrome.action.onClicked.addListener((tab) => {
  console.log("action clicked");
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["foreground.js"]
  });
});
