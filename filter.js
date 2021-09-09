chrome.storage.sync.get(['users', 'selected'], function (result) {
  console.log(result.selected);
  if(result.selected.length != 0){
    var display = {};
    for(group of result.selected) {
      display[group] = result.users[group];
    }
    var s = document.createElement('script');
    s.setAttribute("data", JSON.stringify(display));
    s.src = chrome.runtime.getURL('script.js');
    s.onload = function() {
        this.remove();
    };
    (document.head || document.documentElement).appendChild(s);
    console.log("injected");
  }
});

    /*
    
    1- filter out any tweets except for one account
      

      find the whole tweet element 
      - get article element, then store the whole tweet element, which is its direct parent
      
      check if it is from the user you want to filter
      - under an <a> element , there is <span> element
      gives the username, check if that username matches yours, 
      
      if it does, hide the tweet element
      if it does not, pass


    2- create an input for account name

      - user inputs name, when added, add to unmatched users
      - next page load, find user str from 

    3-  
    
    filter when twitter home page is opened, but contents not yet loaded
      - have to have storage of previous settings

    when twitter home page is opened, check if there exist users in storage
      - if there is filter them
    when user wants to add new uname while the twitter page is open
    when twitter page loads new content

    3- create 2 and more inputs

    4- categorize accounts

    - have categories in users now: users: {haber: {matched, unmatched} }
    - need only to send the categories that are selected to script.js or
    send all categories and only display the selected ones.

    - input, have edit button that unlocks selection, 

    5- automatically draw accounts and dropdown menu 

    */
  