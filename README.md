# twitter-filter-extension
A Chrome extension that filters the tweets of a group of users in the Twitter timeline.

This is a little chrome extension that I wanted to build when I realized that I sometimes wanted to see only some accounts' tweets in the Twitter timeline. 
Most people follow accounts who tweet about various things, and sometimes one may just want to see the latest tweets from the "tech" accounts that one follows.
Hence, the idea to build this extension came about.

# How it works

First of all, the user has to create "groups" of twitter accounts that the user wants to view at a time. The extension has a pretty basic interface
which allows users to create groups and manually add the Twitter account names belonging in those groups. For these actions, the following pages are used:

* `popup.html`: the main interface of the extension. user can select which groups they want to view by checking the boxes of such groups and clicking 
save to save this selection of groups. 

![Alt text](/assets/doc/popupresized.png?raw=true "Popup screen from extension")

* `add_group.html`: where user can create groups and add the accounts for those groups.

![Alt text](/assets/doc/add_groupresized.png?raw=true "Add group screen from extension")

* `background.js` : saves new groups and associated users in local Chrome storage, and also saves the selection of groups that are checked in the 
popup.

Then, when the user opens the Twitter timeline, the extension matches against the URL of the timeline page and executes the content script called
`script.js`. 

* `script.js`: this content script itself injects script to the webpage, which is named `filter.js`.

After `filter.js` is injected to the Twitter page right after the DOM is rendered, it does two things:

* override the default HTTP request handler in order to catch complete API requests from Twitter to "/api/2/timeline". This API call returns a JSON object
with all the tweets that will be displayed in the timeline of the user.
* after catching the HTTP request, edit the response body by deleting the tweets whose users were not in one of the selected categories in the popup.

This is so that when the client-side renders the UI for these tweets, it will only render the tweets of users who were in the selected groups. And voila!
You have a filtered Twitter Timeline.

# Caching work

Besides handling the user settings within the extension, the background script `background.js` also communicates with the script that was injected to the
webpage. Through this interaction, it caches the account-id's of the accounts in the selected groups, which makes it easier and faster to delete these accounts' tweets 
the next time.

# Design Choices

The main object that is stored in the Chrome's local storage is called `users`. It has the following structure:
```
users: {
  group1: {
    unmatched: [account1_name, account2_name,....],
    matched : {
      ids: [account3_id, account4_id, ...],
      names [account3_name, account4_name, ...]
    
    }
  },
  group2: {
    unmatched: [account5_name, account6_name,....],
    matched : {
      ids: [account7_id, account7_id, ...],
      names [account7_name, account7_name, ...]
    
    }
  },
  ...
  
}
```
The unmatched array in each group contains the account names that the user included in the group, whose id's were not cached from Twitter yet. For an account to
move from unmatched to matched, the `filter.js` script that is injected to Twitter looks at the users field in the response body from the API call. If 
it can find the username, it communicates its id back to the background script, so that it can cache it.

The importance of caching user ids is that the tweets in the response body from the API call only have a reference to the user ids, not the user names. In this way,
the `filter.js` script's job gets much easier when it has all the account ids ready.

The extension also stores an array of all groups and an array of the selected groups in the popup, to enable storing user settings.
