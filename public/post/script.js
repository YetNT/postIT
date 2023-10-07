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
const editCommentLinks = document.querySelectorAll(".editComment");

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

async function myFunction() {
    const postId = document.getElementById("postId").value;
    const embedContent = document.getElementById("content");
    let newContent;
    let prompt = prompt("Add new content text.", "i like balls");
    if (prompt == null || prompt == "") {
        newContent = undefined;
    } else {
        newContent = prompt;
    }
    const request = await fetch(`/post/${postId}/edit`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: postId, newContent }),
    });
    const response = await request.json();

    if (response.ok) return embedContent.innerText(newContent);
}

// Assuming you have a form with the id "editForm" and an input field with the id "newContentInput"
editCommentLinks.forEach((link) => {
    link.addEventListener("click", () => {
        let display = 0;
        const commentId = link.getAttribute("data-commentId");
        const userId = link.getAttribute("data-userId");
        const postId = link.getAttribute("data-postId");
        const form = document.getElementById(commentId);

        // Show the hidden form
        form.style.display = display == 0 ? "block" : "none";
        display = display == 0 ? 1 : 0;

        form.addEventListener("submit", async (event) => {
            event.preventDefault();
            const newContent = form.querySelector(".newContent").value;

            try {
                const response = await fetch(
                    `/comment/${postId}/${userId}/${commentId}/${newContent}`,
                    {
                        method: "PATCH",
                    }
                );

                window.location.reload();
            } catch (error) {
                console.error("An error occurred:", error);
            }
        });
    });
});
