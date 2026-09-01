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


/* ORDER FORM SUBMISSION */

document.getElementById("orderForm").addEventListener("submit", function(event) {

    event.preventDefault();

    alert(
        "Order details received for " +
        selectedProductName +
        "."
    );

});