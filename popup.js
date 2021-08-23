
// $(document).ready(function() {
// 	$('.filter').click(function() {
//     var uname = document.getElementById('uname').value;
//     console.log(uname);
// 		chrome.runtime.sendMessage({ "uname": uname })
// 	})
// });

add.addEventListener("click", async () => {
    
    var uname = document.getElementById('uname').value;
    console.log("popup");
    chrome.runtime.sendMessage({"action": "add", "uname": uname });
    
  });

clean.addEventListener("click", async () => {
    
  chrome.runtime.sendMessage({"action": "clean"});
    
}); 
  
  // The body of this function will be executed as a content script inside the
  // current page
  