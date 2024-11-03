hideLoading = () => {
    const loadingDiv = document.getElementById("loading");
    loadingDiv.style.display = "none";
};

showLoading = () => {
    const loadingDiv = document.getElementById("loading");
    loadingDiv.style.display = "grid";
};

async function isAdminLoggedIn() {
    $.ajax({
        url: "/user/isAdminLoggedIn",
        method: "GET",
        dataType: "json",
        success: function(data) {
            if (data.adminCookie) {
            } else {
                alert("Not logged in");
                window.location.href = "./index.html"
            }
        },
        error: function(error) {
            console.error("Error checking admin login status:", error);
        }
    });
}

function adminLogOut() {

}


async function getAllProducts() {
    try {
        const response = await $.ajax({
            url: "/product/getAllProducts",
            method: "GET",
            dataType: "json",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            }
        });
        
        const productDiv = $("#productDiv");
        if (response.products && response.products.length > 0) {
            const html = createAdminProductCard(response.products);
            productDiv.html(html);
        } else {
            productDiv.html("No Products");
        }
    } catch (error) {
        console.error("Error fetching products:", error);
    }
}


function createAdminProductCard(products) {
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
                  <li class="list-group-item">Gender: ${p.gender}</li>
                  <li class="list-group-item">Category: ${p.category}</li>
                </ul>
                <div class="card-body">
                  <button type="button" onclick="deleteProduct('${p._id}')" class="btn btn-primary">
                    Delete
                  </button>
                  <button type="button" onclick="changeModalDiv('update'), getAllCategories(), updateDiv('${p._id}', '${p.title}', ${p.price}, '${p.description}', ${p.amount}, '${p.img}', '${p.category}')" class="btn btn-primary"
                    data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                    Update
                  </button>
                </div>
              </div>
            </div>
        `
    }).join(" ")
    return html
}

async function deleteProduct(productId) {
    try {
        await $.ajax({
            url: "/cart/deleteFromDeleteProduct",
            method: "DELETE",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({ productId: productId })
        });

        await $.ajax({
            url: "/product/deleteFromDeleteProduct",
            method: "DELETE",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({ productId: productId })
        });

        getAllProducts();
    } catch (error) {
        console.error("Error deleting product:", error);
    }
}


async function updateDiv(id,title,price,description,amount,img,category) {
    const updateProductDiv = document.getElementById("updateProduct");
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
    const gender = $("#inlineRadioMale").is(":checked") ? "Male" : "Female";
    ev.target.reset();
    
    $("#updateProduct").hide();
    
    const newProduct = { title, price, description, amount, img, category, gender };
    
    try {
        const response = await $.ajax({
            url: "/product/addProduct",
            method: "POST",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(newProduct)
        });
        
        if (response.isCreated) {
            sendTweet(newProduct)
            window.location.href = "./adminPage.html";
        } else {
            alert("Product already exists");
        }
    } catch (error) {
        console.error("Error adding product:", error);
    }
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
    const gender = $("#inlineRadioMaleUpdate").is(":checked") ? "Male" : "Female";
    ev.target.reset();
    
    const updateProduct = { id, title, price, description, amount, img, category, gender };
    
    try {
        const response = await $.ajax({
            url: "/product/updateProduct",
            method: "PATCH",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(updateProduct)
        });
        
        if (response.isUptadet) {
            window.location.href = "./adminPage.html";
        } else {
            alert("Try again");
        }
    } catch (error) {
        console.error("Error updating product:", error);
    }
}


async function addCategory(ev) {
    ev.preventDefault();
    const category = ev.target.elements.category.value;
    ev.target.reset();

    try {
        const response = await $.ajax({
            url: "/category/addCategory",
            method: "POST",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({ category })
        });

        if (response.isCreated) {
            alert("Category created");
            getAllCategories();
        } else {
            alert("Category already exists");
        }
    } catch (error) {
        console.error("Error adding category:", error);
    }
}


async function getAllCategories() {
    const deleteCategorySelectDiv = $("#deleteCategorySelect");
    const updateCategorySelectDiv = $("#updateCategorySelect");
    const categorySelectDiv = $("#categorySelect");

    try {
        const response = await $.ajax({
            url: "/category/getAllCategories",
            method: "GET",
            contentType: "application/json",
            dataType: "json"
        });

        const categories = response.categories.sort((a, b) => a.category.localeCompare(b.category));
        const html = categories.map(category => `<option value="${category.category}">${category.category}</option>`).join(" ");
        
        deleteCategorySelectDiv.html(html);
        updateCategorySelectDiv.html(html);
        categorySelectDiv.html(html);
    } catch (error) {
        console.error("Error fetching categories:", error);
    }
}


async function deleteCategory(ev) {
    ev.preventDefault();
    const deleteCategory = ev.target.elements.deleteCategory.value;
    ev.target.reset();

    let productsIds;
    
    try {
        await $.ajax({
            url: "/category/deleteCategory",
            method: "DELETE",
            contentType: "application/json",
            data: JSON.stringify({ category: deleteCategory })
        });

        const productResponse = await $.ajax({
            url: "/product/deleteCategory",
            method: "DELETE",
            contentType: "application/json",
            data: JSON.stringify({ category: deleteCategory })
        });
        productsIds = productResponse.productsIds;

        await $.ajax({
            url: "/cart/deleteCategory",
            method: "DELETE",
            contentType: "application/json",
            data: JSON.stringify({ productsIds: productsIds })
        });

        getAllCategories();
        getAllProducts();
    } catch (error) {
        console.error("Error deleting category:", error);
    }
}


async function loadPurchaseHistory() {
    showLoading();
    const purchaseHistoryDiv = $("#purchaseHistory");
    let html = "";

    try {
        const purchasesData = await $.ajax({
            url: "/purchase/getAllPurchases",
            method: "GET",
            contentType: "application/json"
        });
        const purchases = purchasesData.purchases;
        
        for (let i = 0; i < purchases.length; i++) {
            const productsIds = purchases[i].productsIds;
            const productsAmounts = purchases[i].productsAmounts;
            const productsTitle = purchases[i].productsTitels;
            const totalPrice = purchases[i].totalPrice;
            const userId = purchases[i].userId;
            let userName = purchases[i].userName;
            let products = [];


            for (let index = 0; index < productsIds.length; index++) {
                const productData = await $.ajax({
                    url: "/product/getProductById",
                    method: "POST",
                    contentType: "application/json",
                    data: JSON.stringify({ id: productsIds[index] })
                });
                products[index] = productData.product;
            }

            html += `<h3>${userName} bought:</h3>`;
            html += setPurchaseCard(products, productsAmounts, totalPrice, productsTitle);
        }

        purchaseHistoryDiv.html(html);
    } catch (error) {
        console.error("Error loading purchase history:", error);
    } finally {
        hideLoading();
    }
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

function sendTweet(product) {
    // const newProduct = { title, price, description, amount, img, category };
    const tweet = `You can now find ${product.title} for only ${product.price}$ in our store`
    $.ajax({
        url: "/tweet/postTweet",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({ tweet }),
        success: function(data) {
        }
    });
}


function addStoreLocation(ev) {
    ev.preventDefault();
    const storeName = $(ev.target).find('input[name="storeName"]').val();
    const storeLat = $(ev.target).find('input[name="storeLat"]').val();
    const storeLng = $(ev.target).find('input[name="storeLng"]').val();
    const storePhone = $(ev.target).find('input[name="storePhone"]').val();
    const storeCity = $(ev.target).find('input[name="storeCity"]').val();
    $(ev.target).trigger('reset');
    $.ajax({
        url: "/storeLocation/addStoreLocation",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({ name: storeName, lat: storeLat, lng: storeLng, phone: storePhone, city: storeCity }),
        success: function(data) {
        }
    });
}


function changeModalDiv(div) {
    const adminPageModal = document.getElementById("adminPageModal");
    if(div == 'addCategory') {
        adminPageModal.innerHTML = `
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="staticBackdropLabel">Add Category</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form method="post" onsubmit="addCategory(event)">
                  <div class="form-floating">
                    <input type="text" name="category" class="form-control" id="floatingCategory" placeholder="Add Category">
                    <label for="floatingCategory">Add Category</label>
                  </div>
                  <button type="submit" class="btn btn-primary">Add Category</button>
                </form>
            </div>
        `
    } else if(div == 'delete') {
        adminPageModal.innerHTML = `
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="staticBackdropLabel">Delete Category</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body" onsubmit="deleteCategory(event)">
                <form method="post">
                  <select id="deleteCategorySelect" name="deleteCategory" class="form-select" aria-label="Default select example">
                    <!-- category option -->
                  </select>
                  <button type="submit" class="btn btn-primary">Delete Category</button>
                </form>
            </div>
        `
    } else if(div == 'addStore') {
        adminPageModal.innerHTML = `
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="staticBackdropLabel">Add Store</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form method="post" onsubmit="addStoreLocation(event)">
                  <div class="form-floating">
                    <input type="text" name="storeName" class="form-control" placeholder="Store Name">
                    <label for="floatingStoreName">Store Name</label>
                  </div>
                  <div class="form-floating">
                    <input type="number" step="0.000000001" name="storeLat" class="form-control" placeholder="Store Lat">
                    <label for="floatingStoreLat">Store Lat</label>
                  </div>
                  <div class="form-floating">
                    <input type="number" step="0.000000001" name="storeLng" class="form-control" placeholder="Store Lng">
                    <label for="floatingStoreLng">Store Lng</label>
                  </div>
                  <div class="form-floating">
                    <input type="number" maxlength="10" name="storePhone" class="form-control" placeholder="Store Phone">
                    <label for="floatingStorePhone">Store Phone</label>
                  </div>
                  <div class="form-floating">
                    <input type="text" name="storeCity" class="form-control" placeholder="Store City">
                    <label for="floatingStoreCity">Store City</label>
                  </div>
                  <button type="submit" class="btn btn-primary">Add Store</button>
                </form>
            </div>
        `
    } else if(div == 'addProduct') {
        adminPageModal.innerHTML = `
          <div class="modal-header">
              <h1 class="modal-title fs-5" id="staticBackdropLabel">Add Product</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form action="post" onsubmit="handleAddProduct(event)">
                <div class="form-floating mb-3">
                  <input type="text" name="title" class="form-control" id="floatingTitle" placeholder="Product Title"
                    required>
                  <label for="floatingTitle">Product Title</label>
                </div>
                <div class="form-floating">
                  <input type="number" step="0.01" name="price" class="form-control" id="floatingPrice" placeholder="Price" required>
                  <label for="floatingPrice">Price</label>
                </div>
                <div class="form-floating">
                  <textarea class="form-control" name="description" placeholder="Description" id="floatingDescription"
                    style="height: 100px"></textarea>
                  <label for="floatingDescription">Description</label>
                </div>
                <div class="form-floating">
                  <input type="number" name="amount" class="form-control" id="floatingAmount" placeholder="Amount"
                    required>
                  <label for="floatingAmount">Amount</label>
                </div>
                <div class="form-floating">
                  <input type="text" name="img" class="form-control" id="floatingImg" placeholder="Img">
                  <label for="floatingImg">Img (Optional)</label>
                </div>
                <div class="form-floating">
                  <select id="categorySelect" name="category" class="form-select" aria-label="Default select example">
                    <!-- category option -->
                  </select>
                </div>
                <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadioMale" value="Male">
                    <label class="form-check-label" for="inlineRadio1">Male</label>
                </div>
                <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadioFemale" value="Female"
                    checked>
                    <label class="form-check-label" for="inlineRadio2">Female</label>
                </div>
                <button type="submit" class="btn btn-primary">Add</button>
              </form>
          </div>
        `
    } else if(div == 'update') {
        adminPageModal.innerHTML = `
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="staticBackdropLabel">Add Product</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form action="patch" onsubmit="handleUpdateProduct(event)">
                  <div class="form-floating mb-3">
                    <input type="text" name="title" class="form-control" id="floatingTitleUpdate" placeholder="Product Title"
                      required>
                    <label for="floatingTitle">Product Title</label>
                  </div>
                  <div class="form-floating">
                    <input type="number" step="0.01" name="price" class="form-control" id="floatingPriceUpdate" placeholder="Price" required>
                    <label for="floatingPrice">Price</label>
                  </div>
                  <div class="form-floating">
                    <textarea class="form-control" name="description" placeholder="Description" id="floatingDescriptionUpdate"
                      style="height: 100px"></textarea>
                    <label for="floatingDescription">Description</label>
                  </div>
                  <div class="form-floating">
                    <input type="number" name="amount" class="form-control" id="floatingAmountUpdate" placeholder="Amount"
                      required>
                    <label for="floatingAmount">Amount</label>
                  </div>
                  <div class="form-floating">
                    <input type="text" name="img" class="form-control" id="floatingImgUpdate" placeholder="Img">
                    <label for="floatingImg">Img (Optional)</label>
                  </div>
                  <div class="form-floating">
                    <select id="updateCategorySelect" name="category" class="form-select" aria-label="Default select example">
                      <!-- category option -->
                    </select>
                  </div>
                  <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadioMaleUpdate" value="Male">
                        <label class="form-check-label" for="inlineRadio1">Male</label>
                    </div>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadioFemaleUpdate" value="Female"
                        checked>
                        <label class="form-check-label" for="inlineRadio2">Female</label>
                    </div>
                  <input type="text" id="floatingId" name="id" value="asd">
                  <button type="submit" class="btn btn-primary">Update</button>
                </form>
            </div>
        `
    }
}
