
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

function addUser(uname){

    chrome.storage.sync.get({users: []}, async (result) => {
        // the input argument is ALWAYS an object containing the queried keys
        // so we select the key we need
        var users = result.users;
        users.push(uname);
        // set the new array value to the same key
        chrome.storage.sync.set({users: users}, function () {
            // you can use strings instead of objects
            // if you don't  want to define default values
            chrome.storage.sync.get('users', function (result) {

            });
        });
    });
}

function cleanUsers(){
    
    chrome.storage.sync.set({users: []});
}