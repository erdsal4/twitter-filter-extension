
// $(document).ready(function() {
// 	$('.filter').click(function() {
//     var uname = document.getElementById('uname').value;
//     console.log(uname);
// 		chrome.runtime.sendMessage({ "uname": uname })
// 	})
// });

window.onload = function () {

  chrome.storage.sync.get('groups', function (result) {
    console.log(result.groups);
    for(gname of result.groups){
      var group = document.createElement("input");
      group.setAttribute("type","checkbox");
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
    if(group.checked){
      selected.push(group.value);
    }
    group.setAttribute("disabled", "true");
  }
  chrome.runtime.sendMessage({"action": "save-selection", "selected": selected});

}); 
  
newgroup.addEventListener("click", function () {
  window.location.href = "add_group.html";
});
  // The body of this function will be executed as a content script inside the
  // current page
  