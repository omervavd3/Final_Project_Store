hideLoading = () => {
    const loadingDiv = document.getElementById("loading");
    loadingDiv.style.display = "none";
};

showLoading = () => {
    const loadingDiv = document.getElementById("loading");
    loadingDiv.style.display = "grid";
};

async function isUserLoggedIn() {
    await fetch("/user/isUserLoggedIn", {
        method: "GET",
        headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        },
    })
    .then((res) => res.json())
    .then((data) => {
        console.log(data);
        if(data.userCookie) {
            document.getElementById("nav-sign-up").style.display = "none"
            document.getElementById("nav-log-in").style.display = "none"
            document.getElementById("nav-personal").style.display = "block"
            alert("Logged in")
        } else {
            document.getElementById("nav-sign-up").style.display = "block"
            document.getElementById("nav-log-in").style.display = "block"
            document.getElementById("nav-personal").style.display = "none"
            alert("Not logged in")
        }
    })
}

async function getUserCart() {
    showLoading()
    await fetch("/cart/getUserCart", {
        method: "GET",
        headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        },
    })
    .then((res) => res.json())
    .then(async (data) => {
        const userCartDiv = document.getElementById("userCartDiv");
        console.log(data)
        if(data.userCart[0]) {
            console.log(data.userCart);
            var html = await createUserCartProductCard(data.userCart);
            html += '<a href="./checkOut.html">To Checkout</a>'
            userCartDiv.innerHTML = html;
        } else {
            userCartDiv.innerHTML = "No Products"
        }
    })
    hideLoading()
}

async function createUserCartProductCard(userCart) {
    var products = [];
    for (let index = 0; index < userCart.length; index++) {
        await fetch("/product/getProductById", {
            method: "POST",
            headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            },
            body: JSON.stringify({id:userCart[index].productId}),
        })
        .then((res) => res.json())
        .then((data) => {
            products[index] = data.product
        })
    }
    const p = {
        title: String,
        description: String,
        price: Number,
        amount: Number,
        img: String,
        category: String,
        size: Number,
        sex: String
    }
    products.sort((a, b) => a.title.localeCompare(b.title))
    const html = products.map((p,index) => {
        var text = "Add to cart"
        var disableClass = ''
        var bool = false
        if(p.amount == 0) {
            disableClass = 'disable'
            bool = true
            text = "Out of stock"
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
                  <li class="list-group-item">Size: ${p.size}</li>
                </ul>
                <div class="card-body">
                  <a class="card-link" onclick="removeOneFromCart('${p._id}')">Remove One</a>
                  <a class="card-link" onclick="removeAllFromCart('${p._id}', '${userCart[index].amount}')">Remove All</a>
                </div>
              </div>
            </div>
        `
    }).join(" ")
    return html
}

async function removeOneFromCart(productId) {
    showLoading()
    await fetch("/cart/removeOneFromCart", {
        method: "DELETE",
        headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        },
        body: JSON.stringify({productId}),
    })
    .then((res) => res.json())
    .then((data) => {
        console.log(data)
    })
    await fetch("/product/removeOneFromCart", {
        method: "PATCH",
        headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        },
        body: JSON.stringify({productId}),
    })
    .then((res) => res.json())
    .then((data) => {
        console.log(data)
        getUserCart()
    })
    hideLoading()
}

async function removeAllFromCart(productId, amount) {
    showLoading()
    await fetch("/cart/removeAllFromCart", {
        method: "DELETe",
        headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        },
        body: JSON.stringify({productId}),
    })
    .then((res) => res.json())
    .then((data) => {
        console.log(data)
    })
    await fetch("/product/removeAllFromCart", {
        method: "PATCH",
        headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        },
        body: JSON.stringify({productId, amount}),
    })
    .then((res) => res.json())
    .then((data) => {
        console.log(data)
        getUserCart()
    })
    hideLoading()
}