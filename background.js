
chrome.runtime.onMessage.addListener(addUser);

function addUser(uname){

    chrome.storage.local.get({users: []}, function (result) {
        // the input argument is ALWAYS an object containing the queried keys
        // so we select the key we need
        var users = result.users;
        users.push(uname);
        // set the new array value to the same key
        chrome.storage.sync.set({users: users}, function () {
            // you can use strings instead of objects
            // if you don't  want to define default values
            chrome.storage.sync.get('users', function (result) {
                console.log(result.users)
            });
        });
    });
}