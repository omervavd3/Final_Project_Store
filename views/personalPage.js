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