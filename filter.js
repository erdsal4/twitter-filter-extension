// get the groups of people whose tweets will be displayed 
// from script's data attribute.
var data = document.currentScript.getAttribute("data");
var users = JSON.parse(data);

// alter the xml prototype open function to catch relevant api requests
// and edit response body 
var _open = XMLHttpRequest.prototype.open;
window.XMLHttpRequest.prototype.open = function (method, URL) {
   var _onreadystatechange = this.onreadystatechange
      , _this = this;

   _this.onreadystatechange = function () {
      // catch only completed 'api/2/timeline' requests
      if (_this.readyState === 4 && _this.status === 200 && ~URL.indexOf('/api/2/timeline')) {
         try {
            // parse the response text and store all users
            // whose tweets are in response body
            var parsed = JSON.parse(_this.responseText);
            var parsedUsers = parsed.globalObjects.users;
            // userIds for users whose tweets will be displayed.
            var userIds = [];
            // check if there are any users from the groups
            // whose id's are not known, in which case find 
            // their id's from parsedUsers
            for (var [gname, group] of Object.entries(users)) {
               // unmatched has the names of users whose id's are not known
               if (group.unmatched.length) {
                  for (var [, value] of Object.entries(parsedUsers)) {
                     if (group.unmatched.includes(value.screen_name)) {
                        // if we can find the user, then add it to
                        // matched users
                        group.matched.names.push(value.screen_name);
                        group.matched.ids.push(value.id_str);
                        // also remove it from unmatched
                        var index = group.unmatched.indexOf(value.screen_name);
                        if (index > -1) {
                           group.unmatched.splice(index, 1);
                        }
                        // send new users object with ids as a message to extension
                        if (chrome && chrome.runtime && chrome.runtime.sendMessage) {
                           chrome.runtime.sendMessage(
                              "dcchomblnephblhkmbclkhdpknehldbn",
                           { "action": "cache-group", "gname": gname, "group": group }, {}
                           );
                        }
                     }
                  }
               }
               // add the matched ids to the userIds array
               userIds = [...userIds, ...group.matched.ids]
            }
            // delete tweets of users not in the filter group
            var tweets = parsed.globalObjects.tweets;
            for (var [key, value] of Object.entries(tweets)) {
               if (!userIds.includes(value.user_id_str)) {
                  delete tweets[key];
               }
            }
            // rewrite responseText
            Object.defineProperty(_this, 'responseText', { value: JSON.stringify(parsed) });
            /////////////// END //////////////////
         } catch (e) {
            // 
         }
      }
      // call original callback
      if (_onreadystatechange) _onreadystatechange.apply(this, arguments);
   };
   // detect any onreadystatechange changing
   Object.defineProperty(this, "onreadystatechange", {
      get: function () {
         return _onreadystatechange;
      }
      , set: function (value) {
         _onreadystatechange = value;
      }
   });

   return _open.apply(_this, arguments);
};
