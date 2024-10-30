async function handleSignUp(ev) {
    ev.preventDefault();
    const name = ev.target.elements.name.value;
    const password = ev.target.elements.password.value;
    var gender;
    const checkbox = document.getElementById("inlineRadioMale");
    if (checkbox.checked) {
        gender = "Male"
    } else {
        gender = "Female"
    }

    ev.target.reset();
    const user = { name: name, password: password, gender: gender };
    await fetch("/user/signUp", {
        method: "POST",
        headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
    })
    .then((res) => res.json())
    .then((data) => {
        console.log(data);
        if(!data.isCreated) {
            alert("User name already exits")
        } else {
            window.location.href = "./logIn.html"
        }
    })
}