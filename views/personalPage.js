hideLoading = () => {
    const loadingDiv = document.getElementById("loading");
    loadingDiv.style.display = "none";
};

showLoading = () => {
    const loadingDiv = document.getElementById("loading");
    loadingDiv.style.display = "grid";
};

function isUserLoggedIn() {
    $.ajax({
        url: "/user/isUserLoggedIn",
        type: "GET",
        dataType: "json",
        success: function(data) {
            console.log(data);
            if (data.userCookie) {
                
            } else {
                console.log("Hi")
            }
        },
        error: function(error) {
            console.error("Error:", error);
        }
    });
}


function loadPurchaseHistory() {
    showLoading();
    const purchaseHistoryDiv = $("#purchaseHistory");
    let html = "";

    $.ajax({
        url: "/purchase/getPurchasesById",
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        success: function(data) {
            const purchases = data.purchases;
            console.log(purchases);
            let purchasePromises = [];

            for (let i = 0; i < purchases.length; i++) {
                const productsIds = purchases[i].productsIds;
                const productsAmounts = purchases[i].productsAmounts;
                const totalPrice = purchases[i].totalPrice;
                const productsTitle = purchases[i].productsTitels;
                let products = [];

                // Create promises to fetch product details
                for (let index = 0; index < productsIds.length; index++) {
                    purchasePromises.push(
                        $.ajax({
                            url: "/product/getProductById",
                            method: "POST",
                            headers: {
                                Accept: "application/json",
                                "Content-Type": "application/json",
                            },
                            data: JSON.stringify({ id: productsIds[index] }),
                            success: function(data) {
                                products[index] = data.product;
                            }
                        })
                    );
                }

                // After all product fetches are complete, build the HTML
                purchasePromises.push(
                    Promise.all(purchasePromises).then(() => {
                        console.log(productsIds, productsAmounts, totalPrice, products);
                        html += setPurchaseCard(products, productsAmounts, totalPrice, productsTitle);
                    })
                );
            }

            // Wait for all purchase promises to complete
            Promise.all(purchasePromises).then(() => {
                purchaseHistoryDiv.html(html);
                hideLoading();
            });
        },
        error: function(error) {
            console.error("Error fetching purchase history:", error);
            hideLoading();
        }
    });
}


function setPurchaseCard(products, productsAmounts, totalPrice, productsTitle) {
    // products.sort((a, b) => a.title.localeCompare(b.title))
    var html = products.map((p, index) => {
            return `
            <div class="col">
              <div class="card" style="width: 18rem;">
                <div class="card-body">
                  <p>Bought ${productsAmounts[index]}: ${productsTitle[index]}</p>
                </div>
              </div>
            </div>
        `
    }).join(" ")
    html += `<p>Total price of purchase: ${totalPrice}$</p>`
    return html
}

async function changePassword(ev) {
    ev.preventDefault();
    const oldPassword = $(ev.target).find("input[name='oldPassword']").val();
    const newPassword = $(ev.target).find("input[name='newPassword']").val();
    $(ev.target).trigger("reset");


    await $.ajax({
        url: "/user/changePassword",
        method: "PATCH",
        contentType: "application/json",
        data: JSON.stringify({ oldPassword, newPassword }),
        success: function(data) {
            console.log(data);
            if (data.changedPassword) {
                alert("Password changed");
            } else {
                alert("Wrong password")
            }
            window.location.href = "./personalPage.html"
        }
    });
}

async function deleteAccount(ev) {
    ev.preventDefault();
    const password = $(ev.target).find("input[name='password']").val();
    $(ev.target).trigger("reset");


    await $.ajax({
        url: "/user/deleteUser",
        method: "DELETE",
        contentType: "application/json",
        data: JSON.stringify({ password }),
        success: async function(data) {
            console.log(data);
            if (data.isDeleted) {
                await $.ajax({
                    url: "/cart/deleteUser",
                    method: "DELETE",
                    contentType: "application/json",
                    success: function(data) {
                        console.log(data.isDeleted);
                    }
                });
                alert("Account deleted");
                window.location.href = "./index.html"
            } else {
                alert("Something went wrong")
                window.location.href = "./personalPage.html"
            }
        }
    });
}

function personalPageDivChangePass() {
    document.getElementById("personalPageDiv").innerHTML = `
        <div class="modal-header">
            <h1 class="modal-title fs-5" id="staticBackdropLabel">Change Password</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <form action="post" onsubmit="changePassword(event)">
                <div class="form-floating mb-3">
                    <input type="password" name="oldPassword" class="form-control" id="floatingOldPassword"
                        placeholder="Old Password" required>
                    <label for="floatingOldPassword">Old Password</label>
                </div>
                <div class="form-floating">
                    <input type="password" name="newPassword" class="form-control" id="floatingNewPassword"
                        placeholder="New Password" required>
                    <label for="floatingNewPassword">New Password</label>
                </div>
                <button type="submit" class="btn btn-primary">Change Password</button>
            </form>
        </div>
    `
}

function personalPageDivDeleteAccount() {
    document.getElementById("personalPageDiv").innerHTML = `
        <div class="modal-header">
            <h1 class="modal-title fs-5" id="staticBackdropLabel">Delete Account</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <form action="post" onsubmit="deleteAccount(event)">
                <div class="form-floating mb-3">
                    <input type="password" name="password" class="form-control" id="floatingPassword" placeholder="Old Password"
                        required>
                    <label for="floatingPassword">Password</label>
                </div>
                <button type="submit" class="btn btn-primary">Delete Account</button>
            </form>
        </div>
    `
}