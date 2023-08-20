console.log("Script loaded!");
document.addEventListener("DOMContentLoaded", function () {
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

    document
        .getElementById("navbarLines")
        .addEventListener("click", navbarLineButtonClicked);
});

const deleteCommentLinks = document.querySelectorAll(".deleteComment");

// Add a click event listener to each link
deleteCommentLinks.forEach((link) => {
    link.addEventListener("click", async () => {
        const commentId = link.getAttribute("data-commentId");
        const userId = link.getAttribute("data-userId");
        const postId = link.getAttribute("data-postId");

        try {
            const response = await fetch(
                `/comment/${postId}/${userId}/${commentId}`,
                {
                    method: "DELETE",
                }
            );
            window.location.reload();
        } catch (error) {
            console.error(error);
        }
    });
});
