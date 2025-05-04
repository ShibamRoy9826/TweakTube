function redirectFromShorts(){
  if (window.location.href.includes("youtube.com/shorts/")) {
    console.log("Redirecting from Shorts...");
    window.location.replace("https://www.youtube.com/");
}
}

setInterval(() => {
  redirectFromShorts()
}, 3000);

