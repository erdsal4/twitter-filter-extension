window.onload = function () {
    console.log("hello");

}

newuser.addEventListener("click", function () {
    
    var ufield = document.createElement("input");
    ufield.setAttribute("type","text");
    ufield.setAttribute("class", "usern");
    ufield.setAttribute("placeholder","enter username");
    ufield.setAttribute("style", "margin: 5px;");

    var users=document.getElementById("group-users");
    users.appendChild(ufield);  
  }); 

save.addEventListener("click", function () {

    const gname = document.getElementById("gname").value;
    const users = document.getElementsByClassName("usern");
    let unames = [];

    for(user of users){
        unames.push(user.value);
        console.log(user.value);
    }
    chrome.runtime.sendMessage({"action": "newgroup", "gname": gname, "users": unames },
             function (response) {
                window.location.href = "popup.html";
             });
});