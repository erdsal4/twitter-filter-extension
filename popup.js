window.onload = function () {

  chrome.storage.sync.get(['groups', 'selected'], function (result) {
    console.log(result.groups);

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

    if (result.selected != []) {
      console.log(result.selected);
      var groups = document.getElementsByClassName('a-group');
      for (group of groups) {
        if (result.selected.includes(group.id)) {
          group.checked = true;
        }
        group.setAttribute("disabled", "true");
      }
    }

  })
}

edit.addEventListener("click", async () => {

  var groups = document.getElementsByClassName('a-group');
  for (group of groups) {
    group.disabled = false;
  }

});

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

clean.addEventListener("click", async () => {
  var groups = document.getElementsByClassName('a-group');
  if(groups[0].disabled) return;
  var deleted = [];
  var deleted_ids = []
  for (group of groups) {
    if (group.checked) {
      deleted.push(group);
      deleted_ids.push(group.id);
    }
  }
  for (elt of deleted){
    let label = findLableForControl(elt);
    label.remove();
    elt.remove();
  }
  chrome.runtime.sendMessage({ "action": "delete-groups", "deleted": deleted_ids });
}); 

newgroup.addEventListener("click", function () {
  window.location.href = "add_group.html";
});
  // The body of this function will be executed as a content script inside the
  // current page
function findLableForControl(el) {
   var idVal = el.id;
   labels = document.getElementsByTagName('label');
   for( var i = 0; i < labels.length; i++ ) {
      if (labels[i].htmlFor == idVal)
           return labels[i];
   }
}