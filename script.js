console.log("Aarohi Sarees website loaded successfully!");
/* =========================================
   SAREE GALLERY
========================================= */

function selectImage(thumbnail) {

    const gallery =
        thumbnail.closest(".product-gallery");

    const mainImage =
        gallery.querySelector(".main-product-image");

    mainImage.src =
        thumbnail.src;

    const thumbnails =
        gallery.querySelectorAll(".thumbnail");

    thumbnails.forEach(function(item) {

        item.classList.remove("active");

    });

    thumbnail.classList.add("active");
}


/* =========================================
   NEXT IMAGE
========================================= */

function nextImage(button) {

    const gallery =
        button.closest(".product-gallery");

    const thumbnails =
        Array.from(
            gallery.querySelectorAll(".thumbnail")
        );

    const mainImage =
        gallery.querySelector(".main-product-image");

    let currentIndex = 0;

    thumbnails.forEach(function(item, index) {

        if (item.classList.contains("active")) {

            currentIndex = index;

        }

    });

    let nextIndex =
        currentIndex + 1;

    if (nextIndex >= thumbnails.length) {

        nextIndex = 0;

    }

    selectImage(
        thumbnails[nextIndex]
    );
}


/* =========================================
   PREVIOUS IMAGE
========================================= */

function previousImage(button) {

    const gallery =
        button.closest(".product-gallery");

    const thumbnails =
        Array.from(
            gallery.querySelectorAll(".thumbnail")
        );

    let currentIndex = 0;

    thumbnails.forEach(function(item, index) {

        if (item.classList.contains("active")) {

            currentIndex = index;

        }

    });

    let previousIndex =
        currentIndex - 1;

    if (previousIndex < 0) {

        previousIndex =
            thumbnails.length - 1;

    }

    selectImage(
        thumbnails[previousIndex]
    );
}


/* =========================================
   OPEN IMAGE
========================================= */

function openLightbox(image) {

    const lightbox =
        document.getElementById("imageLightbox");

    const lightboxImage =
        document.getElementById("lightboxImage");

    lightboxImage.src =
        image.src;

    lightbox.style.display =
        "flex";
}


/* =========================================
   CLOSE IMAGE
========================================= */

function closeLightbox() {

    const lightbox =
        document.getElementById("imageLightbox");

    lightbox.style.display =
        "none";
}


/* ================= ORDER FORM ================= */

let selectedProductName = "";
let selectedProductPrice = 0;


/* OPEN ORDER FORM */

function openOrderForm(productName, productPrice) {

    selectedProductName = productName;
    selectedProductPrice = productPrice;

    document.getElementById("selectedProduct").textContent = productName;

    document.getElementById("selectedPrice").textContent =
        "₹" + productPrice.toLocaleString("en-IN");

    document.getElementById("orderModal").classList.add("active");

}


/* CLOSE ORDER FORM */

function closeOrderForm() {

    document.getElementById("orderModal").classList.remove("active");

}


/* CLOSE WHEN CLICKING OUTSIDE THE FORM */

document.addEventListener("click", function(event) {

    const modal = document.getElementById("orderModal");

    if (event.target === modal) {

        closeOrderForm();

    }

});


/* ================= RAZORPAY PAYMENT ================= */

document.getElementById("orderForm").addEventListener("submit", async function(event) {

    event.preventDefault();

    try {

        /* Create Razorpay order through Cloudflare Worker */

        const response = await fetch(
            "https://aarohi-payment.firstweb431.workers.dev/create-order",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    productName: selectedProductName
                })
            }
        );

        const order = await response.json();

        if (!response.ok || !order.success) {

            throw new Error(
                order.error
                    ? JSON.stringify(order.error)
                    : "Unable to create payment order."
            );

        }


        /* Razorpay Checkout */

        const options = {

            key: order.keyId,

            amount: order.amount,

            currency: order.currency,

            name: "Aarohi Sarees",

            description: order.productName,

            order_id: order.orderId,

            handler: async function(paymentResponse) {

                try {
            
                    /* Verify payment through Cloudflare Worker */
            
                    const verifyResponse = await fetch(
                        "https://aarohi-payment.firstweb431.workers.dev/verify-payment",
                        {
                            method: "POST",
            
                            headers: {
                                "Content-Type": "application/json"
                            },
            
                            body: JSON.stringify({
            
                                razorpay_order_id:
                                    paymentResponse.razorpay_order_id,
            
                                razorpay_payment_id:
                                    paymentResponse.razorpay_payment_id,
            
                                razorpay_signature:
                                    paymentResponse.razorpay_signature
            
                            })
                        }
                    );
            
            
                    const verification =
                        await verifyResponse.json();
            
            
                    /* Check verification result */
            
                    if (
                        !verifyResponse.ok ||
                        !verification.success
                    ) {
            
                        throw new Error(
                            verification.error ||
                            "Payment verification failed."
                        );
            
                    }
            
            
                    /* Payment successfully verified */
            
                    alert(
                        "Payment successful and verified! 🎉\n\n" +
                        "Product: " +
                        selectedProductName +
                        "\n" +
                        "Amount: ₹" +
                        selectedProductPrice.toLocaleString("en-IN") +
                        "\n\n" +
                        "Payment ID: " +
                        paymentResponse.razorpay_payment_id
                    );
            
            
                    closeOrderForm();
            
            
                } catch (error) {
            
                    console.error(
                        "Payment verification error:",
                        error
                    );
            
            
                    alert(
                        "Payment was received, but verification could not be completed.\n\n" +
                        "Please contact Aarohi Sarees before placing another order."
                    );
            
                }
            
            },

            prefill: {

                name: document.getElementById("customerName")?.value || "",

                contact: document.getElementById("customerPhone")?.value || ""

            },

            theme: {

                color: "#8b5e3c"

            }

        };


        const razorpay = new Razorpay(options);

        razorpay.open();


    } catch (error) {

        console.error("Payment error:", error);

        alert(
            "Unable to start payment.\n\n" +
            "Please try again."
        );

    }

});