async function handleLogIn(ev) {
    ev.preventDefault();
    const name = $(ev.target).find("input[name='name']").val();
    const password = $(ev.target).find("input[name='password']").val();
    $(ev.target).trigger("reset");

    const user = { name: name, password: password };

    await $.ajax({
        url: "/user/logIn",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(user),
        success: function(data) {
            console.log(data);
            if (data.message === "Not found") {
                alert("Wrong user name/password");
            } else {
                if (data.admin) {
                    window.location.href = "./adminPage.html"
                } else {
                    window.location.href = "./index.html"
                }
            }
        }
    });
}
