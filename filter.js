window.onload = setTimeout(function() {
  chrome.storage.sync.get('users', function(result){
  console.log(JSON.parse(JSON.stringify(result.users)))
  if (typeof result.users[0].uname === 'string') {
    console.log("stringmiş");
    let uname = result.users[0].uname;
    var tweets = document.querySelectorAll("article");
    console.log(JSON.parse(JSON.stringify(tweets)));
    // doesn't go into loop for now
    for (tweet of tweets) {
        let username = tweet.querySelector("a div.r-13hce6t span");
        if (username.innerHTML !== uname) {
            tweet.parentNode.parentNode.style.display = "none";
        }
    }
}
})
}, 4000);
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

    3-  
    
    filter when twitter home page is opened, but contents not yet loaded
      - have to have storage of previous settings

    when twitter home page is opened, check if there exist users in storage
      - if there is filter them
    when user wants to add new uname while the twitter page is open
    when twitter page loads new content

    3- create 2 and more inputs

    4- categorize accounts

    5- automatically draw accounts and dropdown menu 

    */
  