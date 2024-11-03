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
            if (data.userCookie) {
                loggedIn = true;
                $("#nav-sign-up, #nav-log-in").hide();
                $("#nav-personal, #nav-cart").show();
            } else {
                loggedIn = false;
                $("#nav-sign-up, #nav-log-in").show();
                $("#nav-personal, #nav-cart").hide();
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
                  <li class="list-group-item">Category: ${p.category}</li>
                  <li class="list-group-item">Gender: ${p.gender}</li>
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
            changeByCategory();
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
            const categories = data.categories
            categories.sort((a, b) => a.category.localeCompare(b.category))
            let html = '<option value="All categories">All categories</option>';
            html += categories.map(category => `
                <option value="${category.category}">${category.category}</option>
            `).join(" ");
            $categorySelectDiv.html(html);
        }
    });
}

async function getMaxPrice() {
    await $.ajax({
        url: "/product/getMaxPrice",
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        success: function(data) {
            return data.maxPrice
        }
    });
}


async function changeByCategory() {
    showLoading();
    const categorySelect = $("#CategorySelect").val();
    const genderSelect = $("#genderSelect").val();
    const priceSelect = $("#priceSelect").val();
    var minPrice = 0
    var maxPrice = 10000000
     if(priceSelect == 1) {
        minPrice = 0
        maxPrice = 49
    } else if(priceSelect == 2) {
        minPrice = 49
        maxPrice = 99
    }

        await $.ajax({
            url: "/product/getByCategory",
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            data: JSON.stringify({ category: categorySelect, gender: genderSelect, minPrice:minPrice, maxPrice:maxPrice }),
            success: function(data) {
                const $productDiv = $("#productDiv");
                if (data.products[0]) {
                    const html = createStoreProductCard(data.products);
                    $productDiv.html(html);
                } else {
                    $productDiv.html("No Products");
                }
            }
        });
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
            $("#amountOfProductsInCart").html(data.amount);
        }
    });
}

async function fetchPerfumeTrends() {
    await $.ajax({
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







let map;
async function initMap() {
    $.ajax({
        url: "/storeLocation/getAllStoresLocations",
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        success: async function(data) {
            // Set a default center position (can be modified based on your data)
            const position = { lat: 32.0853, lng: 34.7818 };

            // Request needed libraries
            //@ts-ignore
            const { Map } = await google.maps.importLibrary("maps");
            const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

            // Create the map, centered at the default position
            const map = new Map(document.getElementById("map"), {
                zoom: 10,
                center: position,
                mapId: "ac8aaf64dee6d263",
            });

            // Loop through the fetched store locations and create markers
            data.stores.forEach(store => {
                const storePosition = { lat: store.lat, lng: store.lng }; // Get latitude and longitude from store data

                // Create a new marker for each store
                const marker = new AdvancedMarkerElement({
                    map: map,
                    position: storePosition,
                    title: store.name, // Use store name as the title
                });
            });

            const contact = data.stores.map(store => `
                                <ul>
                                    <li>Phone: ${store.phone}</li>
                                    <li>City: ${store.city}</li>
                                </ul>
                            `).join(" ");
                            $("#contact").html(contact);
        },
        error: function(xhr, status, error) {
            console.error("Failed to load store locations:", error);
        }
    }); 
}


function logo_overlay() {
    setTimeout(() => {
        document.getElementById('logo-overlay').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('logo-overlay').style.display = 'none';
        }, 1000); // Waits for the fade-out animation to complete
    }, 1500); // Adjust the duration before fade-out as needed (e.g., 3 seconds)
};

function toggleSearch() {
    const searchBar = document.getElementById('searchBar');
    const searchIcon = document.querySelector('.search-icon');

    if (searchBar.style.display === 'none' || !searchBar.classList.contains('active')) {
        searchBar.style.display = 'inline-block'; // Show the search bar
        searchBar.classList.add('active'); // Add the active class
        searchBar.focus(); // Focus on the search bar
        searchIcon.style.display = 'none'; // Hide the search icon
    } else {
        searchBar.style.display = 'none'; // Hide the search bar
        searchBar.classList.remove('active'); // Remove the active class
        searchIcon.style.display = 'inline-block'; // Show the search icon
    }
}
  

 async function searchProducts() {
    $('.search-bar').on('input', async function () {
        const query = $(this).val().trim().toLowerCase();
        showLoading(); // Call your showLoading function if needed
        if (query !== '') {
            await $.ajax({
                url: "/product/searchProducts",
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                data: JSON.stringify({ query }),
                success: function (data) {
                    const $productDiv = $("#productDiv");
                    if (data.products.length > 0) {
                        // Use your existing function or create HTML for the products
                        const html = createStoreProductCard(data.products);
                        $productDiv.html(html);
                    } else {
                        $productDiv.html("No Products");
                    }
                },
                error: function (error) {
                    console.error("Error fetching search results:", error);
                    alert("An error occurred while searching for products.");
                }
            });
        } 
        else {
            // When the search bar is cleared, call changeByCategory() to show all products
            setTimeout(function () {
                $('.search-bar').hide();
                $('.search-icon').show();
            }, 300);
            changeByCategory();
        }

        hideLoading(); // Call your hideLoading function if needed
    });
}
  