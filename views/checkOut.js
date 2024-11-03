const totalAmountsForPurchase = []
const productsIdsForPurchase = []
const productsTitleForPurchase = []
var totalPriceForPurchase = 0
var userGender = ""
var userName = ""

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
            console.log(data);
            if (data.userCookie) {
                $("#nav-sign-up").hide();
                $("#nav-log-in").hide();
                $("#nav-personal").show();
            } else {
                $("#nav-sign-up").show();
                $("#nav-log-in").show();
                $("#nav-personal").hide();
                window.location.href = "./index.html"
            }
        }
    });
}


async function geTotalPrice() {
    showLoading();
    let totalAmounts = [];
    let productsIds = [];
    let productPrice = [];

    await $.ajax({
        url: "/cart/getUserCart",
        method: "GET",
        contentType: "application/json",
        success: function(data) {
            data.userCart.forEach((item, index) => {
                totalAmounts[index] = item.amount;
                totalAmountsForPurchase.push(item.amount);
                productsIds[index] = item.productId;
                productsIdsForPurchase.push(item.productId);
            });
        }
    });

    for (let index = 0; index < productsIds.length; index++) {
        await $.ajax({
            url: "/product/getProductById",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({ id: productsIds[index] }),
            success: function(data) {
                productPrice[index] = data.product.price;
                productsTitleForPurchase[index] = data.product.title;
            }
        });
    }

    let totalPrice = totalAmounts.reduce((sum, amount, index) => sum + productPrice[index] * amount, 0);
    totalPriceForPurchase = totalPrice;

    $("#totalAmount").html(`Total price: ${totalPrice}$`);
    hideLoading();
}



async function payment(ev) {
    ev.preventDefault();
    const name = $(ev.target).find("input[name='name']").val();
    const number = $(ev.target).find("input[name='number']").val();
    const date = $(ev.target).find("input[name='date']").val();
    const cvv = $(ev.target).find("input[name='cvv']").val();
    $(ev.target).trigger("reset");

    if (!validateCardName(name)) {
        alert("Please enter a valid cardholder's name.");
        return;
    }

    if (!validateCardNumber(number)) {
        alert("Please enter a valid card number (16 digits).");
        return;
    }

    if (!validateExpDate(date)) {
        alert("Please enter a valid expiration date in MM/YY format.");
        return;
    }

    if (!validateCVV(cvv)) {
        alert("Please enter a valid 3-digit CVV.");
        return;
    }

    await $.ajax({
        url: "/user/getUserGender",
        method: "GET",
        contentType: "application/json",
        success: function(data) {
            userGender = data.userGender;
        }
    });

    await $.ajax({
        url: "/user/getUserName",
        method: "GET",
        contentType: "application/json",
        success: function(data) {
            userName = data.userName;
        }
    });

    await $.ajax({
        url: "/purchase/addPurchase",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            productsIds: productsIdsForPurchase,
            productsAmounts: totalAmountsForPurchase,
            productsTitleForPurchase: productsTitleForPurchase,
            totalPrice: totalPriceForPurchase,
            userGender: userGender,
            userName: userName
        }),
        success: async function(data) {
            if (data.purchaseCreated) {
                await $.ajax({
                    url: "/cart/clearCartAfterPurchase",
                    method: "GET",
                    contentType: "application/json",
                    success: function() {
                        alert("Payment submitted successfully!");
                        window.location.href = "./index.html"
                    }
                });
            } else {
                alert("Something went wrong... Try again");
            }
        }
    });
}


function validateCardName(name) {
    return name.length > 0;
}

function validateCardNumber(number) {
    return /^\d{16}$/.test(number);
}

function validateExpDate(date) {
    return /^(0[1-9]|1[0-2])\/\d{2}$/.test(date);
}

function validateCVV(cvv) {
    return /^\d{3}$/.test(cvv);
}
