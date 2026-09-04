/* =========================================
   SUPABASE CONNECTION
========================================= */

const SUPABASE_URL =
    "https://cuyjptmspprlsoiafcrg.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_kt4EMLFL2l3Zi0g9vcPzzg_4gTUhx08";

const SUPABASE_HEADERS = {
    "apikey": SUPABASE_PUBLISHABLE_KEY,
    "Authorization": `Bearer ${SUPABASE_PUBLISHABLE_KEY}`
};


/* =========================================
   LOAD PRODUCTS FROM SUPABASE
========================================= */

async function loadProducts() {

    const productGrid = document.getElementById("productGrid");

    if (!productGrid) return;

    try {

        const [productsResponse, imagesResponse] = await Promise.all([

            fetch(
                `${SUPABASE_URL}/rest/v1/products?select=id,product_code,name,slug,description,selling_price,display_order,is_featured,is_active&is_active=eq.true&order=display_order.asc`,
                {
                    headers: SUPABASE_HEADERS
                }
            ),

            fetch(
                `${SUPABASE_URL}/rest/v1/product_images?select=id,product_id,image_url,alt_text,display_order,is_primary&order=display_order.asc`,
                {
                    headers: SUPABASE_HEADERS
                }
            )

        ]);

        if (!productsResponse.ok) {
            throw new Error(`Products request failed: ${productsResponse.status}`);
        }

        if (!imagesResponse.ok) {
            throw new Error(`Images request failed: ${imagesResponse.status}`);
        }

        const products = await productsResponse.json();
        const images = await imagesResponse.json();

        const imagesByProduct = {};

        images.forEach(function(image) {

            if (!imagesByProduct[image.product_id]) {
                imagesByProduct[image.product_id] = [];
            }

            imagesByProduct[image.product_id].push(image);

        });

        productGrid.innerHTML = "";

        if (!products.length) {

            productGrid.innerHTML =
                '<p>Our collection is being updated. Please check back soon.</p>';

            return;

        }

        products.forEach(function(product) {

            const productImages =
                (imagesByProduct[product.id] || [])
                .sort(function(a, b) {
                    return a.display_order - b.display_order;
                });

            if (!productImages.length) return;

            const card = document.createElement("div");
            card.className = "product-card";

            const gallery = document.createElement("div");
            gallery.className = "product-gallery";

            const mainContainer = document.createElement("div");
            mainContainer.className = "main-image-container";

            const prevButton = document.createElement("button");
            prevButton.type = "button";
            prevButton.className = "gallery-arrow prev";
            prevButton.innerHTML = "&#10094;";
            prevButton.onclick = function() {
                previousImage(this);
            };

            const mainImage = document.createElement("img");
            mainImage.src = productImages[0].image_url;
            mainImage.className = "main-product-image";
            mainImage.alt = productImages[0].alt_text || product.name;
            mainImage.loading = "lazy";
            mainImage.onclick = function() {
                openLightbox(this);
            };

            const nextButton = document.createElement("button");
            nextButton.type = "button";
            nextButton.className = "gallery-arrow next";
            nextButton.innerHTML = "&#10095;";
            nextButton.onclick = function() {
                nextImage(this);
            };

            mainContainer.appendChild(prevButton);
            mainContainer.appendChild(mainImage);
            mainContainer.appendChild(nextButton);

            const thumbnails = document.createElement("div");
            thumbnails.className = "thumbnail-container";

            productImages.forEach(function(image, index) {

                const thumbnail = document.createElement("img");
                thumbnail.src = image.image_url;
                thumbnail.className =
                    "thumbnail" + (index === 0 ? " active" : "");
                thumbnail.alt = image.alt_text || `${product.name} image ${index + 1}`;
                thumbnail.loading = "lazy";
                thumbnail.onclick = function() {
                    selectImage(this);
                };

                thumbnails.appendChild(thumbnail);

            });

            gallery.appendChild(mainContainer);
            gallery.appendChild(thumbnails);

            const info = document.createElement("div");
            info.className = "product-info";

            const name = document.createElement("h3");
            name.textContent = product.name;

            const description = document.createElement("p");
            description.className = "description";
            description.textContent = product.description || "Elegant saree design.";

            const price = document.createElement("div");
            price.className = "price";
            price.textContent =
                "₹" + Number(product.selling_price).toLocaleString("en-IN");

            const buyButton = document.createElement("button");
            buyButton.type = "button";
            buyButton.className = "order-btn";
            buyButton.textContent = "Buy Now";
            buyButton.onclick = function() {
                openOrderForm(product.name, Number(product.selling_price));
            };

            info.appendChild(name);
            info.appendChild(description);
            info.appendChild(price);
            info.appendChild(buyButton);

            card.appendChild(gallery);
            card.appendChild(info);

            productGrid.appendChild(card);

        });

    } catch (error) {

        console.error("Unable to load products:", error);

        productGrid.innerHTML =
            '<p>We could not load the collection right now. Please refresh the page or contact us on WhatsApp.</p>';

    }
}


/* Start loading the catalogue after the page is ready. */
loadProducts();


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
            
                    /* ================= CUSTOMER DETAILS ================= */
            
                    const customerName =
                        document.getElementById("customerName")?.value.trim() || "";
            
                    const customerPhone =
                        document.getElementById("customerPhone")?.value.trim() || "";
            
                    const customerAddress =
                        document.getElementById("customerAddress")?.value.trim() || "";
            
                    const customerCity =
                        document.getElementById("customerCity")?.value.trim() || "";
            
                    const customerState =
                        document.getElementById("customerState")?.value.trim() || "";
            
                    const customerPincode =
                        document.getElementById("customerPincode")?.value.trim() || "";
            
            
                    /* ================= VERIFY PAYMENT ================= */
            
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
                                    paymentResponse.razorpay_signature,
            
                                productName:
                                    selectedProductName,
            
                                customerName:
                                    customerName,
            
                                customerPhone:
                                    customerPhone,
            
                                customerAddress:
                                    customerAddress,
            
                                customerCity:
                                    customerCity,
            
                                customerState:
                                    customerState,
            
                                customerPincode:
                                    customerPincode
            
                            })
                        }
                    );
            
            
                    const verification =
                        await verifyResponse.json();
            
            
                    /* ================= CHECK VERIFICATION ================= */
            
                    if (
                        !verifyResponse.ok ||
                        !verification.success
                    ) {
            
                        throw new Error(
                            verification.error ||
                            "Payment verification failed."
                        );
            
                    }
            
            
                    /* ================= SUCCESS ================= */
            
                    alert(
                        "Order placed successfully! 🎉\n\n" +
            
                        "Product: " +
                        selectedProductName +
            
                        "\nAmount: ₹" +
                        selectedProductPrice.toLocaleString("en-IN") +
            
                        "\n\nPayment ID: " +
                        paymentResponse.razorpay_payment_id +
            
                        "\n\nYour order details have been received."
                    );
            
            
                    closeOrderForm();
            
            
                } catch (error) {
            
                    console.error(
                        "Payment verification error:",
                        error
                    );
            
            
                    alert(
                        "Payment was received, but order verification could not be completed.\n\n" +
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