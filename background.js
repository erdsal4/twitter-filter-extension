
// listener for messages from within the extension

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

// listener from external sources-- i.e, the filter script that was injected to page

chrome.runtime.onMessageExternal.addListener(
    function(request, sender, sendResponse) {
 
      if(request.action === 'cache-group'){
        chrome.storage.sync.get('users', function (result) {
            let users = result.users;
            // update the contents of group with cached ids
            users[request.gname] = request.group;
            chrome.storage.sync.set({'users': users});
        });
      }
      sendResponse();
    }
  );

// adds new group in storage
function addNewGroup(gname, users){
    chrome.storage.sync.get({'users':{}, 'groups':[]}, function (result) {
        
        let save = result.users;
        let groups = result.groups;
        
        // add group to main users object
        if(!users[gname]){
            save[gname] = {};
            save[gname]['unmatched'] = []
            save[gname]['matched'] = { 'names': [], 'ids': []};
        }
        for(uname of users){
            save[gname].unmatched.push(uname);
        }

        // add group to groups array
        groups.push(gname);

        chrome.storage.sync.set({'users': save, 'groups': groups});
    });

} 

// sets selected groups

function setSelected(selected) {
    chrome.storage.sync.set({'selected':selected});
}

// deletes groups from storage

function deleteGroups(deleted){
      chrome.storage.sync.get(['users','groups','selected'], function (result) {
       
        let users = result.users;
        let groups = result.groups
        let selected = result.selected;
        
        for(group of deleted){
            // delete group from main users object
            delete users[group];

            // delete from groups array
            let index = groups.indexOf(group);
            if (index > -1) {
                groups.splice(index, 1);
            }

            // delete from selected array
            index = selected.indexOf(group);
            if (index > -1) {
                selected.splice(index, 1);
            }
        }
        chrome.storage.sync.set({'users':users, 'groups':groups, 'selected':selected});
    });
}
