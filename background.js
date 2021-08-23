
// don't quite understand how this works.. twitter probably uses pushState method when
// uploading the page for first time, so this captures that event.

chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) {
    chrome.tabs.executeScript(null,{file:"filter.js"});
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "add"){
        addUser(request.uname);
    } else if(request.action === "clean"){
        cleanUsers();
    }
  }
);

chrome.runtime.onMessageExternal.addListener(
    function(request, sender, sendResponse) {
    //   if(!validate(request.sender)) // Check the URL with a custom function
    //     return;
      if(request.users){
        chrome.storage.sync.set({'users': request.users}, function (result) {
            console.log(result.users);
        });
      }
    }
  );

function addUser(uname){

    chrome.storage.sync.get('users', function (result) {
        // the input argument is ALWAYS an object containing the queried keys
        // so we select the key we need
        console.log(result);
        let save = result.users;
        if(!save){
            console.log("empty");
            save = {};
            save['unmatched'] = []
            save['matched'] = { 'names': [], 'ids': []};
        }
        console.log(save);
        save.unmatched.push(uname);
        console.log(save);
        // set the new array value to the same key
        chrome.storage.sync.set({'users': save});
    });
}

function cleanUsers(){
    
    chrome.storage.sync.remove('users');
}