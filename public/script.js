const socket = io(window.location.origin,{
    withCredentials: true,
    transports: ["websocket"]
});
// let searchProd = document.getElementById("searchProduct");

// searchProd.addEventListener("submit",(e) => {
//     let input = document.getElementById("inpSearch").value;


// });

console.log("Script attached successfully");

let signUp = document.getElementById("signUp");

// signUp.addEventListener("submit",(e) => {
//     let name = document.getElementById("txtName").value;
//     let email = document.getElementById("txtEmail").value;
//     let password = document.getElementById("txtPassword").value;
//     let mobile = document.getElementById("txtMobile").value;
//     let city = document.getElementById("txtCity").value;
//     let country = document.getElementById("txtCountry").value;
//     let zipcode = document.getElementById("txtZipcode").value;
//     let state = document.getElementById("txtState").value;

//     fetch("/custSign",)




// });

// let signupBtn = document.getElementById("btnSignup");
// let cartSummary = document.querySelector(".cart_ProductsTotal");
// let cartTotal = document.querySelector(".total_amount");

// function cartItemsTotal() {
//     let total = 0
//     if (!cartSummary || !cartTotal) return;

//     document.querySelectorAll(".cart-item").forEach(item => {
//         let input_Qty = parseInt(item.querySelector("#inputQty").value);
//         let prod_price = parseInt(item.querySelector(".prod_price").getAttribute("data-price"));
//         let price_Span = parseInt(item.querySelector(".priceValue"));

//         total += prod_price * input_Qty;
//     });
//     cartSummary.textContent = total;
//     cartTotal.textContent = total;
// }

document.querySelectorAll("#incrementBtn").forEach(btn => {
    btn.addEventListener("click", function () {
        let card = this.closest(".cart-item");
        // let qtyInput = Number(card.querySelector(".qtyInput").value); //commented
        let price = card.querySelector(".prod_price");
        let priceSpan = card.querySelector(".priceValue");


        let qty = parseInt(qtyInput);
        qty = qty + 1;
        if (qty > 5) {
            qtyInput.style.background = "red";
            return alert("quantity exceeded");
        }

        // qtyInput = qty; //commented
        card.querySelector(".qtyInput").value = qty;
        let currentPrice = parseInt(price.getAttribute("data-price"));

        let totalPrice = currentPrice * qty;
        priceSpan.innerText = totalPrice;
        console.log("Price : ", priceSpan);
        console.log("total price : ", totalPrice);

        // cartItemsTotal();
        calculateCartTotal();

    });
});


document.querySelectorAll("#decrementBtn").forEach(btn => {
    btn.addEventListener("click", function () {

        let card = this.closest(".cart-item");
        // console.log(card);
        let qtyInput = Number(card.querySelector(".qtyInput").value);
        let price = card.querySelector(".prod_price");
        let priceSpan = card.querySelector(".priceValue");

        let qty = parseInt(qtyInput);
        qty = qty - 1;
        if (qty < 1) return; // prevent negative

        if (qtyInput.style.background = "red") {

            qtyInput.style.background = "#fff";
        }


        qtyInput = qty;

        let currentPrice = parseInt(price.getAttribute("data-price"));
        let totalPrice = currentPrice * qty;
        priceSpan.innerText = totalPrice;

        // cartItemsTotal();
        calculateCartTotal();


    });
});

document.querySelectorAll(".removeFromCart").forEach(btn => {
    btn.addEventListener("click", function () {
        const id = this.dataset.id;

        socket.emit("removeFromCart", id, response => {
            if (response.success) {
                document.querySelector("#cartCount").textContent = response.count;
                document.querySelector(".productsCount").textContent = `Product's : ${response.count}`;
                // cartCount = response.count;

                if (response.count === 0) {
                    window.location.replace("/cart");
                }
                else {

                    // remove from UI
                    this.closest(".cart-item").remove();
                    // cartItemsTotal();
                    calculateCartTotal();
                }
            }
        });
    });
});

//my dailyDeal
// document.addEventListener("DOMContentLoaded", () => {

//     const collapseEl = document.getElementById("collapseDailyDeal");

//     // 👇 THIS IS THE IMPORTANT PART
//     if (!collapseEl) {
//         // not on home page, silently exit
//         return;
//     }

//     console.log("Home page detected, Daily Deal ready");

//     let dailyDealLoaded = false;

//     collapseEl.addEventListener("shown.bs.collapse", () => {
//         console.log("Daily Deal collapse opened");

//         if (!dailyDealLoaded) {
//             dailyDeal();
//             dailyDealLoaded = true;
//         }
//     });

// });

// function dailyDeal() {
//     fetch("/dailyDeal")
//         .then(res => res.json())
//         .then(resp => {
//             console.log("response from backend:", resp);

//             const dailyDealDiv = document.querySelector(".dailyDeal");
//             dailyDealDiv.innerHTML = "";

//             resp.dailydeals.forEach(product => {

//                 const imagePath = product.image?.length
//                     ? `/${product.image[0]}`
//                     : "/uploads/no-image.png";

//                 dailyDealDiv.innerHTML += `
//     <div class="col-lg-4 col-md-6 col-sm-12 d-flex justify-content-center">
//         <div class="card daily-deal-card">
//             <img src="${imagePath}" class="card-img-top daily-deal-img">

//             <div class="card-body text-center p-2">
//                 <h6 class="mb-1">${product.name}</h6>
//                 <p class="small text-muted mb-1 text-truncate">
//                     ${product.description}
//                 </p>

//                 <p class="fw-bold text-success mb-2">
//                     ₹${product.price}
//                     <span class="text-danger">30% OFF</span>
//                 </p>

//                 <button class="btn btn-sm btn-primary w-100" data-id=${product._id}>
//                     ADD TO CART
//                 </button>
//             </div>
//         </div>
//     </div>`;
//             });

//         })
//         .catch(err => console.error("Fetch error:", err));
// }
//dailyDeal ends

// item.querySelector(".removeFromCart").addEventListener("click",() => {
//     let idToRemove = remove_prod.getAttribute("data-id");
//    window.location.href = `/removeFromcart/id=${idToRemove}`
// });




let cartCount = 0;
// document.querySelectorAll("#product").forEach((product) => {
//     document.getElementsByClassName("").;
//     let data = product.textContent;
//     console.log("data : ",data);
// })

// document.querySelectorAll(".card").forEach((data) => {
document.addEventListener("click", (e) => {
    // console.log("in click");
    // Ignore clicks on buttons or links
    // if (e.target.closest("a") || e.target.closest("button")) return;
    if (e.target.closest(".card")) {

        let card = e.target.closest(".card");
        if (!card) return;


        let id = card.dataset.id;
        if (!id) return;

        window.location.href = `/details?id=${id}`;

    }


    if (!e.target.closest("#searchBox")) {
        suggestionBox.innerHTML = "";
    }

    if (e.target.id === "addToCart") {
        let data = e.target;
        let id = data.getAttribute("data-id");

        let qty = 1; // default for details page

        //navigates to cart page (needed)
        // window.location.href = `/cart/?id=${id}`;

        socket.emit("addedToCart", { productId: id, qty }, response => {
            if (!response) return;

            if (response.success) {
                if (response.duplicateId) {

                    showToast("Product Already Added In Cart.", "warning");
                }
                else {
                    showToast("Product Added To Cart.", "success");
                }
                document.querySelector("#cartCount").textContent = response.count;
            }

            // document.querySelector("#cartCount").textContent = response.count;
            // window.location.href = "/"; //Dont redirect to home page

        });

        // window.location.href = `/`;

    }

});

//for quantity updating 
document.addEventListener("click", (e) => {

    if (e.target.closest("#incrementBtn")) {
        handleQty(e, +1);
    }

    if (e.target.closest("#decrementBtn")) {
        handleQty(e, -1);
    }

});

function handleQty(event, changeQty) {
    const card = event.target.closest(".cart-item");
    const productId = card.dataset.id;
    const qtyInput = card.querySelector(".qtyInput");
    const priceSpan = card.querySelector(".priceValue");

    let qty = Number(qtyInput.value) + changeQty;
    if (qty < 1) qty = 1;
    if (qty > 5) {
        alert("Quantity exceeded");
    };
    if (qty === Number(qtyInput.value)) return;
    qtyInput.value = qty;

    // update product row price
    const unitPrice = Number(
        card.querySelector(".prod_price").getAttribute("data-price")
    );
    priceSpan.textContent = unitPrice * qty;

    // update session
    socket.emit("updateCartQty", { productId, qty }, res => {
        if (!res.success) return;
        calculateCartTotal(); // 🔥 ONLY THIS
    });
}


function calculateCartTotal() {
    let total = 0;

    document.querySelectorAll(".cart-item").forEach(card => {
        const qty = Number(card.querySelector(".qtyInput").value);
        const unitPrice = Number(
            card.querySelector(".prod_price").getAttribute("data-price")
        );

        total += qty * unitPrice;
    });

    const totalEl = document.querySelector(".total_amount");
    if (totalEl) {
        totalEl.textContent = total.toFixed(2);
    }
};

let brands_ul = document.querySelector(".brands_ul");

if (brands_ul) {
    brands_ul.addEventListener("change", (e) => {
        if (e.target.type === "checkbox") {
            let brandName = e.target.dataset.brand;

            if (brandName) {
                window.location.href = `/brandFilter?brandName=${encodeURIComponent(brandName)}`;
            }
        }
    });
}


// function updateCartCount() {
//     cartCount = cartCount + 1;
//     let cartItems = document.querySelector("#cartCount");
//     cartItems.textContent = cartCount;
// }



// let search = document.getElementById("searchProducts");
// search.addEventListener("input",(e) => {
//    let text = search.value;
//    console.log("input text : ",text);
// });



// document.addEventListener('DOMContentLoaded', () => {

//     sendEmailPassword();

// });


document.addEventListener("DOMContentLoaded", () => {

  const payBtn = document.getElementById("payBtn");
  if (!payBtn) return; // not on checkout page

  payBtn.addEventListener("click", (e) => {
    e.preventDefault();

    //get form data
    let form = document.getElementById("checkoutForm");
    let formdata = new FormData(form);

    fetch("/place-order", { 
        method: "POST", 
        body : new URLSearchParams(formdata)
    })
      .then(res => res.json())
      .then(data => 
       {
        //address is null - go to add-address 
        if (data.needAddress) {
            alert(data.message || "Please add address.");
            window.location.href = "/add-address";
            return;
        }

        //order creation failed
        if (!data.success) {
            alert("Order creation failed.")
            return;
        }
        
         openRazorpay(data)
       })
      .catch(err => console.log(err.message));
  });

});

// document.addEventListener("DOMContentLoaded", () => {

//   const payBtn = document.getElementById("payBtn");
//   if (!payBtn) return; // not on checkout page

//   payBtn.addEventListener("click", (e) => {
//     e.preventDefault();

//     //get form data
//     let form = document.getElementById("checkoutForm");
//     let formdata = new FormData(form);

//     fetch("/place-order", { 
//         method: "POST", 
//         body : new URLSearchParams(formdata)
//     })
//       .then(res => res.json())
//       .then(data => openRazorpay(data))
//       .catch(err => console.log(err.message));
//   });

// });


function openRazorpay(data){
  const options = {
    key : data.key,
    amount : data.amount,
    currency : "INR" ,
    order_id : data.orderId,
      method: {
      upi: true,
      card: true,
      netbanking: true,
      wallet: true
    },
    handler : function(response){
        verifyPayment(response,data.dbOrderId)
    },
    modal:{
        ondismiss : function () {
            alert("payment cancelled . please try again");
        }
    }
  };
  const rzp = new Razorpay(options);

  rzp.on("payment.failed",function (response) {
    console.error("payment failed.",response.error);
    alert("payment failed. please try again.");
  });
  rzp.open();
};


function verifyPayment(response,dbOrderId){
  fetch("/verify-payment",{
    method : "POST",
    headers : {"content-type" : "application/json"},
    body : JSON.stringify({
      razorpay_order_id : response.razorpay_order_id,
      razorpay_payment_id : response.razorpay_payment_id,
      razorpay_signature : response.razorpay_signature,
      dbOrderId : dbOrderId
    })

  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
        window.location.href = "/order-success";
    }
    else{
        alert("payment verification failed.");
    }
  });
};

document.addEventListener("DOMContentLoaded", () => {
    let collapseEl = document.getElementById("collapseDailyDeal");

    if (!collapseEl) {
        return;
    }

    let dailyDealLoaded = false;
    collapseEl.addEventListener("shown.bs.collapse", () => {
        if (!dailyDealLoaded) {
            loadDailyDeal();
            dailyDealLoaded = true;
        }
    })
});


// function sendEmailPassword() {

// if (window.location.href = "/checkout") {
//     calculateCartTotal();
// }


//Sign Up
// document.addEventListener("DOMContentLoaded", () => {
//     let signUpForm = document.getElementById("signUpForm");
//     let name = document.getElementById("usrName");
//     let email = document.getElementById("usrEmail");
//     let password = document.getElementById("usrPassword");
//     let mobile = document.getElementById("usrMobile");
//     let country = document.getElementById("usrCountry");
//     let state = document.getElementById("usrState");
//     let city = document.getElementById("usrCity");
//     let zipcode = document.getElementById("usrZipcode");

//     if (!signUpForm || !name || !email || !password || !mobile || !country || !state || !city || !zipcode) {
//         return;
//     }

//     signUpForm.addEventListener("submit", (e) => {
//         e.preventDefault();
//         let customerdata = {
//             name: name.value,
//             email: email.value,
//             password: password.value,
//             mobile: mobile.value,
//             country: country.value,
//             state: state.value,
//             city: city.value,
//             zipcode: zipcode.value
//         }
//         console.log(customerdata);

//         fetch("/signUp", {
//             method: "POST",
//             headers: {
//                 "content-type": "application/json",
//             },
//             body: JSON.stringify(customerdata)

//         })
//             .then(resp => resp.json())
//             .then(data => console.log("Success : ", data))
//             .catch((error) => console.log("error occured in signup : ", error.message))
//     })

// })


function loadDailyDeal() {
    $.ajax({
        type: "GET",
        url: "/dailyDeal",
        success: function (data) {
            $("#dailyDeal").html(data);
        },
        error: function () {
            console.log("Error occured in dailydeal");
        }
    })
}

let search = document.getElementById("searchBox");
search.addEventListener("submit", (e) => {
    e.preventDefault();
    // console.log("input value : ",input.value);
    let txtInp = input.value;
    window.location.href = `/category/?data=${txtInp}&filterBy=products`


})

let input = document.getElementById("searchProducts");
const suggestionBox = document.getElementById("list-tab");

input.addEventListener("input", (e) => {
    if (input.value.length >= 3) {
        let inpText = input.value;
        //  console.log(inpText);
        suggestionBox.innerHTML = "";

        fetch(`/searchBy/?name=${inpText}`)
            .then(async response => {
                if (response.ok) {
                    let products = await response.json();
                    console.log("Response : ", products);

                    products.product.forEach(product => {
                        // console.log("in for each : ",product);
                        // let ul = document.createElement("ul");
                        // let li = document.createElement("li");
                        // let span = document.createElement("span");
                        // span.textContent = product.name;

                        // li.appendChild(span);
                        // ul.appendChild(li);
                        // input.appendChild(ul);

                        const item = document.createElement("a");
                        item.className = "list-group-item list-group-item-action";
                        item.textContent = product.name;

                        // OPTIONAL: navigate on click
                        item.href = `/details/?id=${product._id}`;

                        suggestionBox.appendChild(item);

                    });

                }
            })
            .catch(error => {
                console.log("Error fetching data : ", error.message);

            }
            )
    }
});

function showToast(message, type = "info") {
    let bg = "#333";

    if (type === "success") bg = "green";
    if (type === "error") bg = "red";
    if (type === "warning") bg = "orange";

    Toastify({
        text: message,
        duration: 3000,
        gravity: "top",
        position: "center",
        style: {
            background: bg
        }

    }).showToast();

}

// showToast("Toastify working","warning");

// let cart = document.getElementById("addToCart"); 
// cart.addEventListener("click",(e) => {
//     let productId = this.getAttribute("data-id");
//     console.log(productId);
// // window.location.href = `/cart/?id=${productId}`;

// });



function filterByCategory() {
    console.log("function executed");
}

document.addEventListener("DOMContentLoaded", () => {
    // cartItemsTotal();
    calculateCartTotal();


});
// cartItemsTotal();
