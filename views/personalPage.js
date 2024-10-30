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

        } else {

        }
    })
}

async function loadPurchaseHistory() {
    showLoading()
    const purchaseHistoryDiv = document.getElementById("purchaseHistory");
    var html = ""
    await fetch("/purchase/getPurchasesById", {
        method: "GET",
        headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        },
    })
    .then((res) => res.json())
    .then(async (data) => {
        purchases = data.purchases
        console.log(purchases)
        for (let i = 0; i < purchases.length; i++) {
            var productsIds = [];
            var productsAmounts = [];
            var totalPrice = purchases[i].totalPrice;
            var products = [];
            var productsTitle = [];
            for (let j = 0; j < purchases[i].productsIds.length; j++) {
                productsIds[j] = purchases[i].productsIds[j]              
                productsAmounts[j] = purchases[i].productsAmounts[j]
                productsTitle[j] = purchases[i].productsTitels[j]
            }
            for (let index = 0; index < productsIds.length; index++) {
                await fetch("/product/getProductById", {
                    method: "POST",
                    headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    },
                    body: JSON.stringify({id:productsIds[index]}),
                })
                .then((res) => res.json())
                .then((data) => {
                    products[index] = data.product
                })
            }
            console.log(productsIds,
                productsAmounts,
                totalPrice,
                products)
            html += setPurchaseCard(products, productsAmounts, totalPrice, productsTitle)
        }
    })
    purchaseHistoryDiv.innerHTML = html
    hideLoading()
}

function setPurchaseCard(products, productsAmounts, totalPrice, productsTitle) {
    // products.sort((a, b) => a.title.localeCompare(b.title))
    var html = products.map((p, index) => {
        if(p) {
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
                  <li class="list-group-item">Size: ${p.size}</li>
                </ul>
                <div class="card-body">
                    <p>Bought ${productsAmounts[index]} from item</p>
                </div>
              </div>
            </div>
        `
        } else {
            return `
            <div class="col">
              <p>${productsTitle[index]}</p>
              Item no longer in store
            </div>
            `
        }
    }).join(" ")
    html += `<p>Total price of purchase: ${totalPrice}$</p>`
    return html
}