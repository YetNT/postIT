function generateSlug(title) {
    // Convert to lowercase and replace non-alphanumeric characters and spaces with a dash
    return title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "") // Replace non-word characters (excluding spaces and dashes)
        .replace(/\s+/g, "-") // Replace spaces with dashes
        .replace(/-+/g, "-"); // Replace consecutive dashes with a single dash
}

function passwordError(input) {
    document.getElementById("passwordError").innerText = input;
}

document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");

    form.addEventListener("submit", async function (event) {
        event.preventDefault();
        const password = document.getElementById("password").value;
        const username = document.getElementById("username").value;
        const id = generateSlug(username);

        const cpResponse = await fetch("/api/correctPassword", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: id, password: password }),
        });

        const cpData = await cpResponse.json();
        if (!cpResponse.ok) return passwordError("user does not exist?");

        if (!cpData.correct) {
            return passwordError("Incorrect password, noob");
        }

        form.submit();
    });
});
