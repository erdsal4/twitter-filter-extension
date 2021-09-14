// onload, load the user settings, i.e. groups and the selected ones 

window.onload = function () {

  chrome.storage.sync.get(['groups', 'selected'], function (result) {
    // load the groups into popup page
    for (gname of result.groups) {
      var group = document.createElement("input");
      group.setAttribute("type", "checkbox");
      group.setAttribute("class", "a-group");
      group.setAttribute("id", gname);
      group.setAttribute("style", "margin: 5px;");
      var label = document.createElement("label");
      label.setAttribute("for", gname);
      label.innerHTML = gname;
      var groups = document.getElementById("group-list");
      groups.appendChild(group);
      groups.appendChild(label);
    }

    // if any groups were selected, make them checked and make all checkboxes disabled
    if (result.selected != []) {
      var groups = document.getElementsByClassName('a-group');
      for (group of groups) {
        if (result.selected.includes(group.id)) {
          group.checked = true;
        }
        // make the groups uneditable
        group.setAttribute("disabled", "true");
      }
    }

  })
}

// on clicking edit, make each checkbox checkable

edit.addEventListener("click", async () => {

  var groups = document.getElementsByClassName('a-group');
  for (group of groups) {
    group.disabled = false;
  }

});

// on clicking save, save the selected groups and send them to background script

save.addEventListener("click", async () => {

  var groups = document.getElementsByClassName('a-group');
  var selected = [];
  for (group of groups) {
    if (group.checked) {
      selected.push(group.id);
    }
    group.setAttribute("disabled", "true");
  }
  chrome.runtime.sendMessage({ "action": "save-selection", "selected": selected });

});

// on clicking clean (i.e. delete), delete the groups from both display,
// and send background a message to delete them from storage

clean.addEventListener("click", async () => {

  var groups = document.getElementsByClassName('a-group');
  // don't do anything if checkboxes are disabled
  if(groups[0].disabled) return;
  // add checked groups to a deleted array
  var deleted = [];
  var deleted_ids = []
  for (group of groups) {
    if (group.checked) {
      deleted.push(group);
      deleted_ids.push(group.id);
    }
  }
  // remove the group element and its label from screen
  for (elt of deleted){
    let label = findLableForControl(elt);
    label.remove();
    elt.remove();
  }

  chrome.runtime.sendMessage({ "action": "delete-groups", "deleted": deleted_ids });
}); 

// on clicking newgroup, change window location to add_group
newgroup.addEventListener("click", function () {
  window.location.href = "add_group.html";
});
 
// helper function to find label for control
function findLableForControl(el) {
   var idVal = el.id;
   labels = document.getElementsByTagName('label');
   for( var i = 0; i < labels.length; i++ ) {
      if (labels[i].htmlFor == idVal)
           return labels[i];
   }
}