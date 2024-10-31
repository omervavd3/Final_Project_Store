function handleSignUp(ev) {
    ev.preventDefault();
    const name = ev.target.elements.name.value;
    const password = ev.target.elements.password.value;
    const gender = $("#inlineRadioMale").is(":checked") ? "Male" : "Female";

    ev.target.reset();
    const user = { name: name, password: password, gender: gender };

    $.ajax({
        url: "/user/signUp",
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        data: JSON.stringify(user),
        success: function(data) {
            console.log(data);
            if (!data.isCreated) {
                alert("User name already exists");
            } else {
                window.location.href = "./logIn.html";
            }
        },
        error: function(error) {
            console.error("Error during sign up:", error);
            alert("An error occurred. Please try again.");
        }
    });
}
