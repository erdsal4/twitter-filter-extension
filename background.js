
// don't quite understand how this works.. twitter probably uses pushState method when
// uploading the page for first time, so this captures that event.

chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) {
   // chrome.scripting.executeScript({target: null, files:["filter.js"]});
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "add"){
        addUser(request.uname);
    } else if(request.action === "clean"){
        cleanUsers();
    } else if(request.action === "newgroup"){
        if(request.gname){
            addNewGroup(request.gname,request.users);
        }
        sendResponse("okay");
    } else if(request.action === "save-selection"){
        setSelected(request.selected);
    } 
     else if(request.action === "delete-groups"){
        deleteGroups(request.deleted);
    } 
    
  }
);

chrome.runtime.onMessageExternal.addListener(
    function(request, sender, sendResponse) {
 
      if(request.action === 'cache-group'){
        console.log("caching group");
        chrome.storage.sync.get('users', function (result) {
            let users = result.users;
            users[request.gname] = request.group;
            chrome.storage.sync.set({'users': users});
        });
      }
      sendResponse();
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

function addNewGroup(gname, users){
    console.log(gname);
    chrome.storage.sync.get({'users':{}, 'groups':[]}, function (result) {
        // the input argument is ALWAYS an object containing the queried keys
        // so we select the key we need
        console.log(result);
        let save = result.users;
        let groups = result.groups;
        if(!save[gname]){
            save[gname] = {};
            save[gname]['unmatched'] = []
            save[gname]['matched'] = { 'names': [], 'ids': []};
        }
        for(uname of users){
            save[gname].unmatched.push(uname);
        }
        console.log(save);
        groups.push(gname);
        // set the new array value to the same key
        chrome.storage.sync.set({'users': save, 'groups': groups});
    });

} 

function setSelected(selected) {

    chrome.storage.sync.set({'selected':selected});

}
 function deleteGroups(deleted){
    
      chrome.storage.sync.get(['users','groups','selected'], function (result) {
        let users = result.users;
        let groups = result.groups
        let selected = result.selected;
        for(group of deleted){
            console.log(group);
            delete users[group];
            let index = groups.indexOf(group);
            if (index > -1) {
                groups.splice(index, 1);
            }
            index = selected.indexOf(group);
            if (index > -1) {
                selected.splice(index, 1);
            }
        }
        chrome.storage.sync.set({'users':users, 'groups':groups, 'selected':selected});
    });
}
