const shorts="https://youtube.com/shorts";

function setTheme(theme,tabID){
  chrome.scripting.insertCSS({
    files: [`themes/${theme}.css`],
    target: { tabId: tabID },
  });
}

chrome.action.onClicked.addListener(async (tab) => {
    if (tab.url.startsWith(shorts)) {
        chrome.tabs.update(tab.id, { url: "https://www.youtube.com" });
    }
});


chrome.tabs.onActivated.addListener((currTab) => {
    chrome.tabs.get(currTab.tabId, (tab) => {
        if (tab.url && tab.url.includes("youtube.com")) {
          chrome.storage.local.get("theme", (data) => {
              if(data.theme==undefined){
                chrome.storage.local.set({theme:"default"});
                setTheme("default",tab.id);
              }else{
                setTheme(data.theme,tab.id);
              }
          });
        }
    });
});

chrome.tabs.onUpdated.addListener((tabId,currTabInfo,tab) => {
    chrome.tabs.get(tabId, (tab) => {
        if (tab.url && tab.url.includes("youtube.com")) {
          chrome.storage.local.get("theme", (data) => {
              if(data.theme==undefined){
                chrome.storage.local.set({theme:"default"});
                setTheme("default",tab.id);
              }else{
                setTheme(data.theme,tab.id);
              }
          });
        }
    });
});


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if(message.theme!==undefined && message.tabID!==undefined){
    setTheme(message.theme,message.tabID);
}

});
