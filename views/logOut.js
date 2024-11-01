function logOut() {
    $.ajax({
        url: "/user/logOut",
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        success: function(data) {
            if (data.loggedOut) {
                window.location.href = "./index.html";
            } else {
                alert("Something went wrong");
            }
        },
        error: function(error) {
            console.error("Error during logout:", error);
            alert("An error occurred. Please try again.");
        }
    });
}
