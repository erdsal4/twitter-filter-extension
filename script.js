// get selected groups and load script into webpage with the groups data

chrome.storage.sync.get(['users', 'selected'], function (result) {
  if(result.selected.length != 0){
    var display = {};
    for(group of result.selected) {
      display[group] = result.users[group];
    }
    var s = document.createElement('script');
    s.setAttribute("data", JSON.stringify(display));
    s.src = chrome.runtime.getURL('filter.js');
    s.onload = function() {
        this.remove();
    };
    (document.head || document.documentElement).appendChild(s);
  }
});
  