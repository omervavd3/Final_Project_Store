async function handleLogIn(ev) {
    ev.preventDefault();
    const name = ev.target.elements.name.value;
    const password = ev.target.elements.password.value;
    ev.target.reset();
    const user = { name: name, password: password };
    await fetch("/user/logIn", {
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
        if(data.message == "Not found") {
            alert("Wrong user name/password")
        } else {
            if(data.admin) {

            } else {
                
            }
        }
    })
}