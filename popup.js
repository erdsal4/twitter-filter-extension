// When the button is clicked, inject setPageBackgroundColor into current page
filter.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, url: "https://twitter.com/home" });
    
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: filterTweets,
    });
  });
  
  // The body of this function will be executed as a content script inside the
  // current page
  function filterTweets() {
    
    var tweets = document.getElementsByTagName("article");

    for(tweet of tweets) {
      let username = tweet.querySelector("a div.r-13hce6t span");
      console.log(username);
      if(username.innerHTML === "@KurtogluKagan"){
        tweet.parentNode.style.display = "none";
      }
    }
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

    3- create 2 and more inputs

    4- categorize accounts

    5- automatically draw accounts and dropdown menu 

    */
  }