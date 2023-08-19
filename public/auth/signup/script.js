function hasSpecialCharacters(input) {
    const specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    return specialCharacters.test(input);
}

function hasNumbers(input) {
    const numbers = /[0-9]+/;
    return numbers.test(input);
}

function hasUppercaseLetters(input) {
    const uppercaseLetters = /[A-Z]+/;
    return uppercaseLetters.test(input);
}

function hasLowercaseLetters(input) {
    const lowercaseLetters = /[a-z]+/;
    return lowercaseLetters.test(input);
}

function passwordError(input) {
    document.getElementById("passwordError").innerText = input;
}

function usernameError(input) {
    document.getElementById("usernameError").innerText = input;
}

document.addEventListener("DOMContentLoaded", function () {
    // Find the form element
    const form = document.querySelector("form");

    // Listen for the form's submit event
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        const password = document.getElementById("password").value;
        const username = document.getElementById("username").value;

        if (hasSpecialCharacters(username))
            return usernameError("Username cannot contain special characters.");
        if (username.length < 4) return usernameError("Username is too short.");

        if (!hasNumbers(password))
            return passwordError("Password does not contain numbers!");
        if (!hasLowercaseLetters(password))
            return passwordError(
                "Password does not contain lowercase letters!"
            );
        if (!hasUppercaseLetters(password))
            return passwordError(
                "Password does not contain uppercase letters!"
            );
        if (!hasSpecialCharacters(password))
            return passwordError(
                "Password does not contain special characters!"
            );
        if (password.length < 5) return passwordError("Password is too short!");
        form.submit();
    });
});
