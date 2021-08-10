
// $(document).ready(function() {
// 	$('.filter').click(function() {
//     var uname = document.getElementById('uname').value;
//     console.log(uname);
// 		chrome.runtime.sendMessage({ "uname": uname })
// 	})
// });

filter.addEventListener("click", async () => {
    
    var uname = document.getElementById('uname').value;
    console.log("popup");
    chrome.runtime.sendMessage({ "uname": uname })
    
  });

filter.addEventListener("clean", async () => {
    
    chrome.storage.sync.set({users: []})
    
}); 
  
  // The body of this function will be executed as a content script inside the
  // current page
  