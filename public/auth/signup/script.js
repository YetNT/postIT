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

function invalidPassword(input) {
    document.getElementById("error").innerText = input;
}

document.addEventListener("DOMContentLoaded", function () {
    // Find the form element
    const form = document.querySelector("form");

    // Listen for the form's submit event
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        const password = document.getElementById("password").value;
        if (!hasNumbers(password))
            return invalidPassword("Password does not contain numbers!");
        if (!hasLowercaseLetters(password))
            return invalidPassword(
                "Password does not contain lowercase letters!"
            );
        if (!hasUppercaseLetters(password))
            return invalidPassword(
                "Password does not contain uppercase letters!"
            );
        if (!hasSpecialCharacters(password))
            return invalidPassword(
                "Password does not contain special characters!"
            );
        if (password.length < 5)
            return invalidPassword("Password is too short!");
        form.submit();
    });
});
