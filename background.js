 /**
  * adds new group in storage
  * @param {*} gname new group name 
  * @param {*} users users in new group
  */
  function addNewGroup(gname, users) {
    chrome.storage.sync.get({ "users": {}, "groups": [] }, function (result) {
       var save = result.users;
       var groups = result.groups;
       // add group to main users object
       if (!users[gname]) {
          save[gname] = {};
          save[gname].unmatched = [];
          save[gname].matched = { "names": [], "ids": [] };
       }
       for (var uname of users) {
          save[gname].unmatched.push(uname);
       }
       // add group to groups array
       groups.push(gname);
       chrome.storage.sync.set({ 'users': save, 'groups': groups });
    });
 }

 /**
  * sets selected groups
  * @param {*} selected selected group
  */
 function setSelected(selected) {
    chrome.storage.sync.set({ "selected": selected });
 }

 /**
  * deletes groups from storage
  * @param {*} deleted deleted groups
  */
 function deleteGroups(deleted) {
    chrome.storage.sync.get(["users", "groups", "selected"], function (result) {
       var users = result.users;
       var groups = result.groups;
       var index = groups.indexOf(group);
       var selected = result.selected;
       index = selected.indexOf(group);
       for (var group of deleted) {
          // delete group from main users object
          delete users[group];
          // delete from groups array
          if (index > -1) {
             groups.splice(index, 1);
          }
          // delete from selected array
          if (index > -1) {
             selected.splice(index, 1);
          }
       }
       chrome.storage.sync.set({ "users": users, "groups": groups, "selected": selected });
    });
 }

 /**
  * listener for messages from within the extension
  */
 chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === "newgroup") {
       if (request.gname) {
          addNewGroup(request.gname, request.users);
       }
       sendResponse("okay");
    } else if (request.action === "save-selection") {
       setSelected(request.selected);
    } else if (request.action === "delete-groups") {
       deleteGroups(request.deleted);
    }
 });

 /**
  * listener from external sources-- i.e, the filter 
  * script that was injected to page
  */
 chrome.runtime.onMessageExternal.addListener(
    function (request, sender, sendResponse) {
       if (request.action === "cache-group") {
          chrome.storage.sync.get("users", function (result) {
             var users = result.users;
             // update the contents of group with cached ids
             users[request.gname] = request.group;
             chrome.storage.sync.set({ "users": users });
          });
       }
       sendResponse();
    }
 );
