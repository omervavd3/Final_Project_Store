const totalAmountsForPurchase = []
const productsIdsForPurchase = []
const productsTitleForPurchase = []
var totalPriceForPurchase = 0
var userGender = ""

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

async function geTotalPrice() {
    showLoading()
    var totalAmounts = []
    var productsIds = []
    var productPrice = []
    await fetch("/cart/getUserCart", {
        method: "GET",
        headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        },
    })
    .then((res) => res.json())
    .then((data) => {
        for (let index = 0; index < data.userCart.length; index++) {
            totalAmounts[index] = data.userCart[index].amount
            totalAmountsForPurchase.push(data.userCart[index].amount)
            productsIds[index] = data.userCart[index].productId
            productsIdsForPurchase.push(data.userCart[index].productId)
        }
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
            productPrice[index] = data.product.price
            productsTitleForPurchase[index] = data.product.title
        })
    }
    var totalPrice = 0
    for (let index = 0; index < productsIds.length; index++) {
        totalPrice += productPrice[index] * totalAmounts[index]
    }
    totalPriceForPurchase = totalPrice
    const totalAmountDiv = document.getElementById("totalAmount")
    totalAmountDiv.innerHTML = `Total price: ${totalPrice}$`
    hideLoading()
}


async function payment(ev) {
    ev.preventDefault();
    const name = ev.target.elements.name.value;
    const number = ev.target.elements.number.value;
    const date = ev.target.elements.date.value;
    const cvv = ev.target.elements.cvv.value;
    ev.target.reset();

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
    
    await fetch("/user/getUserGender", {
        method: "GET",
        headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        },
    })
    .then((res) => res.json())
    .then((data) => {
        userGender = data.userGender
    })

    await fetch("/purchase/addPurchase", {
        method: "POST",
        headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        },
        body: JSON.stringify({productsIds:productsIdsForPurchase, productsAmounts:totalAmountsForPurchase,productsTitleForPurchase:productsTitleForPurchase, totalPrice:totalPriceForPurchase, userGender:userGender}),
    })
    .then((res) => res.json())
    .then(async (data) => {
        if(data.purchaseCreated) {
            await fetch("/cart/clearCartAfterPurchase", {
                method: "GET",
                headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                },
            })
            .then((res) => res.json())
            .then((data) => {
                alert("Payment submitted successfully!");
            })
        } else {
            alert("Something went wrong... Try again")
        }
    })
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
