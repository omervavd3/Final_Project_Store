hideLoading = () => {
    const loadingDiv = document.getElementById("loading");
    loadingDiv.style.display = "none";
};

showLoading = () => {
    const loadingDiv = document.getElementById("loading");
    loadingDiv.style.display = "grid";
};

async function isAdminLoggedIn() {
    await fetch("/user/isAdminLoggedIn", {
        method: "GET",
        headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        },
    })
    .then((res) => res.json())
    .then((data) => {
        console.log(data);
        if(data.adminCookie) {
            alert("Logged in")
        } else {
            alert("Not logged in")
        }
    })
}

async function getAllProducts() {
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
            const html = createAdminProductCard(data.products);
            productDiv.innerHTML = html;
        } else {
            productDiv.innerHTML = "No Products"
        }
    })
}

function createAdminProductCard(products) {
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
                  <li class="list-group-item">Category: ${p.category}</li>
                </ul>
                <div class="card-body">
                  <a href="#" class="card-link" onclick="deleteProduct('${p._id}')">Delete</a>
                  <a href="#updateProduct" class="card-link" onclick="updateDiv('${p._id}', '${p.title}', ${p.price}, '${p.description}', ${p.amount}, '${p.img}', '${p.category}')">Update</a>
                </div>
              </div>
            </div>
        `
    }).join(" ")
    return html
}

async function deleteProduct(productId) {
    await fetch("/cart/deleteFromDeleteProduct", {
        method: "DELETE",
        headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        },
        body: JSON.stringify({productId:productId}),
    })
    .then((res) => res.json())
    .then((data) => {

    })
    await fetch("/product/deleteFromDeleteProduct", {
        method: "DELETE",
        headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        },
        body: JSON.stringify({productId:productId}),
    })
    .then((res) => res.json())
    .then((data) => {

    })
    getAllProducts()
}

async function updateDiv(id,title,price,description,amount,img,category) {
    const updateProductDiv = document.getElementById("updateProduct");
    updateProductDiv.style.display = "block"
    document.getElementById("floatingId").value = `${id}`
    document.getElementById("floatingTitleUpdate").value = `${title}`
    document.getElementById("floatingPriceUpdate").value = `${price}`
    document.getElementById("floatingDescriptionUpdate").value = `${description}`
    document.getElementById("floatingAmountUpdate").value = `${amount}`
    document.getElementById("floatingImgUpdate").value = `${img}`
    // document.getElementById("floatingCategoryUpdate").value = `${category}`
}

async function handleAddProduct(ev) {
    ev.preventDefault();
    const title = ev.target.elements.title.value;
    const price = ev.target.elements.price.value;
    const description = ev.target.elements.description.value;
    const amount = ev.target.elements.amount.value;
    const img = ev.target.elements.img.value;
    const category = ev.target.elements.category.value;
    ev.target.reset();
    const updateProductDiv = document.getElementById("updateProduct");
    updateProductDiv.style.display = "none"
    const newProduct = {title, price,description,amount,img:img,category};
    await fetch("/product/addProduct", {
        method: "POST",
        headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduct),
    })
    .then((res) => res.json())
    .then((data) => {
        if(data.isCreated) {
            window.location.href = "./adminPage.html"
        } else {
            alert("Product already exists")
        }
    })
}

async function handleUpdateProduct(ev) {
    ev.preventDefault();
    const title = ev.target.elements.title.value;
    const price = ev.target.elements.price.value;
    const description = ev.target.elements.description.value;
    const amount = ev.target.elements.amount.value;
    const img = ev.target.elements.img.value;
    const category = ev.target.elements.category.value;
    const id = ev.target.elements.id.value;
    ev.target.reset();
    const updateProduct = {id,title, price,description,amount,img:img,category};
    await fetch("/product/updateProduct", {
        method: "PATCH",
        headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        },
        body: JSON.stringify(updateProduct),
    })
    .then((res) => res.json())
    .then((data) => {
        if(data.isUptadet) {
            window.location.href = "./adminPage.html"
        } else {
            alert("Try again")
        }
    })
}

async function addCategory(ev) {
    ev.preventDefault();
    const category = ev.target.elements.category.value;
    ev.target.reset();
    await fetch("/category/addCategory", {
        method: "POST",
        headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        },
        body: JSON.stringify({category}),
    })
    .then((res) => res.json())
    .then((data) => {
        if(data.isCreated) {
            alert("Category created");
            getAllCategories()
        } else {
            alert("Category already exists")
        }
    })
}

async function getAllCategories() {categorySelect
    const deleteCategorySelectDiv = document.getElementById("deleteCategorySelect");
    const updateCategorySelectDiv = document.getElementById("updateCategorySelect");
    const categorySelectDiv = document.getElementById("categorySelect");
    await fetch("/category/getAllCategories", {
        method: "GET",
        headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        },
    })
    .then((res) => res.json())
    .then((data) => {
        const categories = data.categories
        categories.sort((a, b) => a.category.localeCompare(b.category))
        const html = categories.map((category) => {
            return `
                <option value="${category.category}">${category.category}</option>
            `
        }).join(" ")
        deleteCategorySelectDiv.innerHTML = html
        updateCategorySelectDiv.innerHTML = html
        categorySelectDiv.innerHTML = html
    })
}

async function deleteCategory(ev) {
    ev.preventDefault();
    const deleteCategory = ev.target.elements.deleteCategory.value;
    ev.target.reset();
    var productsIds
    await fetch("/category/deleteCategory", {
        method: "DELETE",
        headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        },
        body: JSON.stringify({category:deleteCategory}),
    })
    .then((res) => res.json())
    .then((data) => {
    })
    await fetch("/product/deleteCategory", {
        method: "DELETE",
        headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        },
        body: JSON.stringify({category:deleteCategory}),
    })
    .then((res) => res.json())
    .then((data) => {
        productsIds = data.productsIds
    })
    await fetch("/cart/deleteCategory", {
        method: "DELETE",
        headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        },
        body: JSON.stringify({productsIds:productsIds}),
    })
    .then((res) => res.json())
    .then((data) => {
        getAllCategories()
        getAllProducts()
    })
}

async function loadPurchaseHistory() {
    showLoading()
    const purchaseHistoryDiv = document.getElementById("purchaseHistory");
    var html = ""
    await fetch("/purchase/getAllPurchases", {
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
            var userId = purchases[i].userId;
            var userName = ""
            var products = [];
            var productsTitle = [];
            for (let j = 0; j < purchases[i].productsIds.length; j++) {
                productsIds[j] = purchases[i].productsIds[j]              
                productsAmounts[j] = purchases[i].productsAmounts[j]
                productsTitle[j] = purchases[i].productsTitels[j]
            }
            await fetch("/user/getUserNameById", {
                method: "POST",
                headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                },
                body: JSON.stringify({userId:userId}),
            })
            .then((res) => res.json())
            .then((data) => {
                userName = data.userName;
            })
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
            html += `<h3>${userName} bought:</h3>`
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