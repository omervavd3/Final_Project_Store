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
    showLoading();
    
    await $.ajax({
        url: "/user/isUserLoggedIn",
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        success: function(data) {
            console.log(data);
            if (data.userCookie) {
                loggedIn = true;
                $("#nav-sign-up, #nav-log-in").hide();
                $("#nav-personal").show();
                alert("Logged in");
            } else {
                loggedIn = false;
                $("#nav-sign-up, #nav-log-in").show();
                $("#nav-personal").hide();
                alert("Not logged in");
            }
        }
    });
    
    hideLoading();
}


async function getAllProducts() {
    showLoading();
    
    await $.ajax({
        url: "/product/getAllProducts",
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        success: function(data) {
            const productDiv = $("#productDiv");
            if (data.products.length > 0) {
                console.log(data.products);
                const html = createStoreProductCard(data.products);
                productDiv.html(html);
            } else {
                productDiv.html("No Products");
            }
        }
    });
    
    hideLoading();
}


function createStoreProductCard(products) {
    products.sort((a, b) => a.title.localeCompare(b.title))
    const html = products.map((p) => {
        var text = "Add to cart"
        var disableClass = ''
        var bool = false
        if(p.amount <= 0 || !loggedIn) {
            disableClass = 'disable'
            bool = true
        } 
        if(p.amount <= 0 && loggedIn) {
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
    showLoading();
    
    await $.ajax({
        url: "/cart/addToCart",
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        data: JSON.stringify({ productId: id }),
        success: function(data) {
            console.log(data);
        }
    });
    
    await $.ajax({
        url: "/product/addToCart",
        method: "PATCH",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        data: JSON.stringify({ productId: id }),
        success: function(data) {
            console.log(data);
            getAllProducts();
        }
    });
    
    amountOfProductsInCart();
    hideLoading();
}


async function getAllCategories() {
    const $categorySelectDiv = $("#CategorySelect");
    
    await $.ajax({
        url: "/category/getAllCategories",
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        success: function(data) {
            console.log(data.categories);
            let html = '<option value="All categories">All categories</option>';
            html += data.categories.map(category => `
                <option value="${category.category}">${category.category}</option>
            `).join(" ");
            $categorySelectDiv.html(html);
        }
    });
}


async function changeByCategory() {
    showLoading();
    const categorySelect = $("#CategorySelect").val();

    if (categorySelect === "All categories") {
        getAllProducts();
    } else {
        await $.ajax({
            url: "/product/getByCategory",
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            data: JSON.stringify({ category: categorySelect }),
            success: function(data) {
                const $productDiv = $("#productDiv");
                if (data.products[0]) {
                    console.log(data.products);
                    const html = createStoreProductCard(data.products);
                    $productDiv.html(html);
                } else {
                    $productDiv.html("No Products");
                }
            }
        });
    }
    hideLoading();
}


async function amountOfProductsInCart() {
    await $.ajax({
        url: "/cart/amountOfProductsInCart",
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        success: function(data) {
            console.log(data);
            $("#amountOfProductsInCart").html(data.amount);
        }
    });
}

function fetchPerfumeTrends() {
    $.ajax({
        url: '/api/perfume-trends',
        method: 'GET',
        success: function(data) {
            if (data.success) {
                const trendsContainer = $('#perfume-trends');
                trendsContainer.html(data.data.map(article => `
                    <div>
                        <h2>${article.title}</h2>
                        <img src="${article.image}" alt="${article.title}" width="200" />
                        <p>${article.description}</p>
                        <a href="${article.url}" target="_blank">Read more</a>
                    </div>
                    <hr />
                `).join(''));
            } else {
                console.error("Failed to load perfume trends:", data.message);
            }
        },
        error: function(error) {
            console.error("Error fetching perfume trends:", error);
        }
    });
}


fetchPerfumeTrends();


function initMap() {
    $.ajax({
        url: "/storeLocation/getAllStoresLocations",
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        success: function(data) {
            const map = L.map('map').setView([32.0853, 34.7818], 11);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            const locations = data.stores.map(store => ({
                lat: store.lat,
                lng: store.lng,
                name: store.name
            }));

            locations.forEach(location => {
                const marker = L.marker([location.lat, location.lng]).addTo(map);
                marker.bindPopup(`<b>${location.name}</b><br>Coordinates: ${location.lat}, ${location.lng}`);
            });

            const contact = data.stores.map(store => `
                <ul>
                    <li>Phone: ${store.phone}</li>
                    <li>City: ${store.city}</li>
                </ul>
            `).join(" ");
            $("#contact").html(contact);
        },
        error: function(error) {
            console.error("Error fetching store locations:", error);
        }
    });
}
