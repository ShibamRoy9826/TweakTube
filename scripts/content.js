toggledShorts=false;

function hideCategories(){
  const categories=document.querySelector("iron-selector#chips");

  if(categories){
    categories.remove();
  }

  const categoriesCont=document.querySelector("ytd-feed-filter-chip-bar-renderer");
  if(categoriesCont){
    categoriesCont.remove();
  }
}

function hideSidebar(){
  const sidebar=document.querySelector("ytd-mini-guide-renderer");
  if(sidebar){
    sidebar.remove()
  }
}

function hideShorts(){
  // Toggling shorts from sidebar
  const sidebarShorts = document.querySelector("ytd-mini-guide-entry-renderer[aria-label='Shorts']");
  if (sidebarShorts && !toggledShorts) {
    sidebarShorts.remove()
    toggledShorts=true;
  }
  // Toggling shorts from extended sidebar
  const sidebarExShorts=document.querySelector("a.yt-simple-endpoint[title='Shorts']");
  if(sidebarExShorts){
    sidebarExShorts.remove()
  }
  // Toggling shorts sections
  const shortVid=document.querySelectorAll("ytd-rich-item-renderer[is-slim-media]");
  if(shortVid){
    shortVid.forEach((e)=>{
      e.remove()
    });
  }
  // Toggling shorts 
  const shortVidHeader=document.querySelectorAll("div#rich-shelf-header");
  if (shortVidHeader){
    shortVidHeader.forEach((a)=>{
      a.style.display="none";
    });
  }

  // toggling short recommendations while at a video
  const shortRecom=document.querySelectorAll("ytd-reel-shelf-renderer");
  if (shortRecom){
    shortRecom.forEach((e)=>{
      e.style.display="none";
    })
  }

  if (window.location.href.includes("youtube.com/shorts/")) {
    console.log("Redirecting from Shorts...");
    window.location.replace("https://www.youtube.com/");
}

}

function checkhome() {
    const url= window.location.href;
    return /^https?:\/\/(www\.)?youtube\.com\/?$/.test(url);
}

function hideHome(){

  const home=document.querySelector("#contents");
  const searchCont=document.querySelector("#center.style-scope.ytd-masthead");
  const logo=document.querySelector("#logo-icon");
  const country=document.querySelector("#country-code");

  if (checkhome()){
    if(home){ 
      home.style.display="none";
    }
    if(searchCont){
      searchCont.style.position="relative";
      searchCont.style.top="50vh";
    }
    if(logo){
      logo.style.position="absolute";
      logo.style.top="20vh";
      logo.style.left="30vw";
      logo.style.width="30vw";
      logo.style.height="20vh";
    }
    if(country){
      country.style.position="absolute";
      country.style.top="25vh";
      country.style.left="62vw";
    }
  }
  else{
    if(home){ 
      home.style.display="";
    }
    if(searchCont){
      searchCont.style.position="relative";
      searchCont.style.top="0px";
    }
    if(logo){
      logo.style.position="absolute";
      logo.style.top="0px";
      logo.style.left="3vw";
      logo.style.width="98px";
      logo.style.height="20px";
    }
    if(country){
      country.style.display="none";
    }
  }

}

function hideSuggestions(){
  const div=document.querySelector("#secondary");
  div.remove();
}

function hideHam(){
  const ham=document.querySelector("#guide-button.style-scope.ytd-masthead");
  if(ham){
    ham.remove();
  }

}


const observer = new MutationObserver(() =>{
  chrome.storage.local.get("hideshorts", (data) => {
    if (data.hideshorts) {
        hideShorts();
    } 
  });
  chrome.storage.local.get("hidecategories", (data) => {
    if (data.hidecategories) {
        hideCategories();
    } 
  });
  chrome.storage.local.get("hidesidebar", (data) => {
    if (data.hidesidebar) {
        hideSidebar();
    } 
  });

  chrome.storage.local.get("hideham", (data) => {
    if (data.hideham) {
        hideHam();
    } 
  });

  chrome.storage.local.get("hidehome", (data) => {
    if (data.hidehome) {
        hideHome();
        window.addEventListener("popstate",hideHome());
        const ogPush= history.pushState;
        history.pushState = function(...args) {
            ogPush.apply(this, args);
            hideHome();
        };

        const ogReplace= history.replaceState;
        history.replaceState = function(...args) {
            ogReplace.apply(this, args);
            hideHome();
        };
    } 
  });

  chrome.storage.local.get("hidesuggestions", (data) => {
    if (data.hidesuggestions) {
        hideSuggestions();
    } 
  });
});


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.hideshorts !== undefined) {
      if (message.hideshorts) {
          hideShorts();
      }
  }
  if (message.hidecategories!== undefined){
    if(message.hidecategories){
      hideCategories();
    }
  }
  if(message.hidesidebar!==undefined){
    if(message.hidesidebar){
      hideSidebar();
    }
  }

  if(message.hidesidebar!==undefined){
    if(message.hidesuggestions){
      hideSuggestions();
    }
  }

  if(message.hidesidebar!==undefined){
    if(message.hidehome){
      hideHome();
    }
  }

  if(message.hidesidebar!==undefined){
    if(message.hideham){
      hideham();
    }
  }
  if(message.theme!==undefined && message.tabID!==undefined){
      // sending message to worker to apply theme
      chrome.runtime.sendMessage({ action: "applyCSS",theme:message.theme,tabID:message.tabID });
  }
});

observer.observe(document.body, { childList: true, subtree: true });
