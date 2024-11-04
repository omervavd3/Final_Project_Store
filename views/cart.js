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
        method: "GET",
        contentType: "application/json",
        success: function(data) {
            if (data.userCookie) {
                $("#nav-sign-up").hide();
                $("#nav-log-in").hide();
                $("#nav-personal").show();
            } else {
                $("#nav-sign-up").show();
                $("#nav-log-in").show();
                $("#nav-personal").hide();
                alert("Not logged in")
                window.location.href = "./index.html"
            }
        }
    });
}


function getUserCart() {
    showLoading();
    $.ajax({
        url: "/cart/getUserCart",
        method: "GET",
        contentType: "application/json",
        success: function(data) {
            const userCartDiv = $("#userCartDiv");
            if (data.userCart[0]) {
                createUserCartProductCard(data.userCart).then(html => {
                    html += '<a href="./checkOut.html">To Checkout</a>';
                    userCartDiv.html(html);
                });
            } else {
                userCartDiv.html("No Products");
            }
        },
        complete: hideLoading
    });
}


function createUserCartProductCard(userCart) {
    var products = [];
    var requests = userCart.map((item, index) => {
        return $.ajax({
            url: "/product/getProductById",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({ id: item.productId }),
            success: function(data) {
                products[index] = data.product;
            }
        });
    });
    return Promise.all(requests).then(() => {
        products.sort((a, b) => a.title.localeCompare(b.title));
        const html = products.map((p, index) => {
            var text = "Add to cart";
            var disableClass = '';
            var bool = false;
            if (p.amount == 0) {
                disableClass = 'disable';
                bool = true;
                text = "Out of stock";
            }
            return `
                <div class="col">
                  <div class="card" style="width: 18rem;">
                    <img src="${p.img}" class="card-img-top" alt="...">
                    <div class="card-body">
                      <h5 class="card-title">${p.title}</h5>
                      <p class="card-text">${p.description}</p>
                    </div>
                    <ul class="list-group list-group-flush">
                      <li class="list-group-item">Price: ${p.price}$</li>
                      <li class="list-group-item">Amount: ${userCart[index].amount}</li>
                    </ul>
                    <div class="card-body">
                      <a class="card-link" onclick="removeOneFromCart('${p._id}')">Remove One</a>
                      <a class="card-link" onclick="removeAllFromCart('${p._id}', '${userCart[index].amount}')">Remove All</a>
                    </div>
                  </div>
                </div>
            `;
        }).join(" ");
        return html;
    });
}


function removeOneFromCart(productId) {
    showLoading();
    $.ajax({
        url: "/cart/removeOneFromCart",
        method: "DELETE",
        contentType: "application/json",
        data: JSON.stringify({ productId }),
        success: function(data) {
            $.ajax({
                url: "/product/removeOneFromCart",
                method: "PATCH",
                contentType: "application/json",
                data: JSON.stringify({ productId }),
                success: function(data) {
                    getUserCart();
                }
            });
        }
    }).always(hideLoading);
}


function removeAllFromCart(productId, amount) {
    showLoading();
    $.ajax({
        url: "/cart/removeAllFromCart",
        method: "DELETE",
        contentType: "application/json",
        data: JSON.stringify({ productId }),
        success: function(data) {
            $.ajax({
                url: "/product/removeAllFromCart",
                method: "PATCH",
                contentType: "application/json",
                data: JSON.stringify({ productId, amount }),
                success: function(data) {
                    getUserCart();
                }
            });
        }
    }).always(hideLoading);
}
