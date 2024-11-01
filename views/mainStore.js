hideLoading = () => {
    const loadingDiv = document.getElementById("loading");
    loadingDiv.style.display = "none";
};

showLoading = () => {
    const loadingDiv = document.getElementById("loading");
    loadingDiv.style.display = "grid";
};

var loggedIn = false


async function isUserLoggedIn() {
    showLoading()
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
            loggedIn = true
            document.getElementById("nav-sign-up").style.display = "none"
            document.getElementById("nav-log-in").style.display = "none"
            document.getElementById("nav-personal").style.display = "block"
            alert("Logged in")
        } else {
            loggedIn = false
            document.getElementById("nav-sign-up").style.display = "block"
            document.getElementById("nav-log-in").style.display = "block"
            document.getElementById("nav-personal").style.display = "none"
            alert("Not logged in")
        }
    })
    hideLoading()
}

async function getAllProducts() {
    showLoading()
    await fetch("/product/getAllProducts", {
        method: "GET",
        headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        },
    })
    .then((res) => res.json())
    .then((data) => {
        const productDiv = document.getElementById("productDiv");
        if(data.products[0]) {
            console.log(data.products);
            const html = createStoreProductCard(data.products);
            productDiv.innerHTML = html;
        } else {
            productDiv.innerHTML = "No Products"
        }
    })
    hideLoading()
}

function createStoreProductCard(products) {
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
    const html = products.map((p) => {
        var text = "Add to cart"
        var disableClass = ''
        var bool = false
        if(p.amount == 0 || !loggedIn) {
            disableClass = 'disable'
            bool = true
        } 
        if(p.amount == 0 && loggedIn) {
            text = "Out of stock"
        } 
        if(p.amount != 0 && !loggedIn) {
            text = "Log in to add to cart"
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
                  <li class="list-group-item">Amount: ${p.amount}</li>
                  <li class="list-group-item">Size: ${p.size}</li>
                </ul>
                <div class="card-body">
                  <a class="card-link ${disableClass}" aria-disabled="${bool}" onclick="addToCart('${p._id}')">${text}</a>
                </div>
              </div>
            </div>
        `
    }).join(" ")
    return html
}

async function addToCart(id) {
    showLoading()
    await fetch("/cart/addToCart", {
        method: "POST",
        headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        },
        body: JSON.stringify({productId:id}),
    })
    .then((res) => res.json())
    .then((data) => {
        console.log(data)
    })
    await fetch("/product/addToCart", {
        method: "PATCH",
        headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        },
        body: JSON.stringify({productId:id}),
    })
    .then((res) => res.json())
    .then((data) => {
        console.log(data)
        getAllProducts()
    })
    amountOfProductsInCart()
    hideLoading()
}

async function getAllCategories() {
    const CategorySelectDiv = document.getElementById("CategorySelect");
    await fetch("/category/getAllCategories", {
        method: "GET",
        headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        },
    })
    .then((res) => res.json())
    .then((data) => {
        console.log(data.categories)
        var html = '<option value="All categories">All categories</option>'
        html += data.categories.map((category) => {
            return `
                <option value="${category.category}">${category.category}</option>
            `
        }).join(" ")
        CategorySelectDiv.innerHTML = html
    })
}

async function changeByCategory() {
    showLoading()
    const categorySelect = document.getElementById("CategorySelect").value;
    if(categorySelect == "All categories") {
        getAllProducts()
    } else {
        await fetch("/product/getByCategory", {
            method: "POST",
            headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            },
            body: JSON.stringify({category:categorySelect}),
        })
        .then((res) => res.json())
        .then((data) => {
            const productDiv = document.getElementById("productDiv");
            if(data.products[0]) {
                console.log(data.products);
                const html = createStoreProductCard(data.products);
                productDiv.innerHTML = html;
            } else {
                productDiv.innerHTML = "No Products"
            }
        })
    }
    hideLoading()
}

async function amountOfProductsInCart() {
    await fetch("/cart/amountOfProductsInCart", {
        method: "GET",
        headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        },
    })
    .then((res) => res.json())
    .then((data) => {
        console.log(data)
        const amountOfProductsInCartDiv = document.getElementById("amountOfProductsInCart")
        amountOfProductsInCartDiv.innerHTML = data.amount
    })
}