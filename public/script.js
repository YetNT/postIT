console.log("Script loaded!");

var hide = true; // Start with true to match initial state of visibility

function navbarLineButtonClicked() {
    var navAs = document.getElementById("topnav").querySelectorAll(".navA");

    if (hide) {
        for (let i = 0; i < navAs.length; i++) {
            navAs[i].style.opacity = 0;
        }
        document.getElementById("topnav").style.opacity = 0;
        document.getElementById("navbarBackground").style.backgroundColor =
            "#424549";
    } else {
        for (let i = 0; i < navAs.length; i++) {
            navAs[i].style.opacity = 1;
        }
        document.getElementById("topnav").style.opacity = 1;
        document.getElementById("navbarBackground").style.backgroundColor =
            "rgba(25, 25, 25, 0.4)";
    }

    hide = !hide; // Toggle the value of hide
}
