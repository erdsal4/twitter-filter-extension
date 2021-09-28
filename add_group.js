/**
 * on clicking newuser, adds a new user name field on the page
 */
 newuser.addEventListener("click", function () {
    var ufield = document.createElement("input");
    var users = document.getElementById("group-users");
    ufield.setAttribute("type", "text");
    ufield.setAttribute("class", "usern");
    ufield.setAttribute("placeholder", "enter username");
    ufield.setAttribute("style", "margin: 2px 5px;");
    users.appendChild(ufield);
 });
 
 /**
  * gets the new group name and its users and sends 
  * them to background to handle it
  */
 save.addEventListener("click", function () {
    var gname = document.getElementById("gname")
       .value;
    var users = document.getElementsByClassName("usern");
    var unames = [];
    for (var user of users) {
       unames.push(user.value);
    }
    chrome.runtime.sendMessage({
          "action": "newgroup"
          , "gname": gname
          , "users": unames
       }
       , function () {
          window.location.href = "popup.html";
       });
 });
 