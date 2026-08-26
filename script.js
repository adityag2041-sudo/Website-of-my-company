"use strict";

/*
  IMPORTANT:
  Change the product names, prices, descriptions and images below
  according to your real products.
*/

const products = [
  {
    id: 1,
    name: "Himal-200gm",
    price: 60,
    unit: "packet",
    description: "High-quality food product from Shiva Guru.",
    image: "images/qw (2).png"
  },
  {
    id: 2,
    name: "Himal-150gm",
    price: 50,
    unit: "packet",
    description: "Fresh, hygienic and carefully manufactured.",
    image: "images/qw (1).png"
  },
  {
    id: 3,
    name: "Himal-5kg",
    price: 950,
    unit: "packet",
    description: "Made using carefully selected ingredients.",
    image: "images/arnav.png"
  },
  {
    id: 4,
    name: "Sonam-150gm",
    price: 45,
    unit: "packet",
    description: "Premium quality food for your family.",
    image: "images/arnav1.png"
  }
];

/*
  Stores selected quantity for each product.
  Example:
  {
    1: 2,
    2: 0,
    3: 4,
    4: 1
  }
*/

const orderQuantities = {};

products.forEach((product) => {
  orderQuantities[product.id] = 0;
});

/* Render product cards on the main website */

function renderProducts() {
  const productGrid = document.getElementById("productGrid");

  if (!productGrid) {
    return;
  }

  productGrid.innerHTML = products
    .map(
      (product) => `
        <article class="product-card">
          <div class="product-image-wrapper">
            <img
              src="${product.image}"
              alt="${product.name}"
              class="product-image"
              onerror="this.src='https://placehold.co/400x300?text=${encodeURIComponent(
                product.name
              )}'"
            />
          </div>

          <div class="product-card-content">
            <h3>${product.name}</h3>

            <p>${product.description}</p>

            <div class="product-card-bottom">
              <strong>Rs. ${formatNumber(product.price)}</strong>

              <span>Per ${product.unit}</span>
            </div>
          </div>
        </article>
      `
    )
    .join("");
}

/* Render all products inside the combined order form */

function renderOrderProducts() {
  const orderProductList = document.getElementById("orderProductList");

  if (!orderProductList) {
    return;
  }

  orderProductList.innerHTML = products
    .map(
      (product) => `
        <div class="order-product-item">
          <img
            src="${product.image}"
            alt="${product.name}"
            class="order-product-image"
            onerror="this.src='https://placehold.co/120x120?text=Product'"
          />

          <div class="order-product-information">
            <h4>${product.name}</h4>

            <p>
              Rs. ${formatNumber(product.price)} per ${product.unit}
            </p>

            <div class="quantity-controller">
              <button
                type="button"
                class="quantity-button"
                onclick="decreaseQuantity(${product.id})"
                aria-label="Decrease ${product.name} quantity"
              >
                −
              </button>

              <span
                class="quantity-number"
                id="quantity-${product.id}"
              >
                ${orderQuantities[product.id]}
              </span>

              <button
                type="button"
                class="quantity-button"
                onclick="increaseQuantity(${product.id})"
                aria-label="Increase ${product.name} quantity"
              >
                +
              </button>
            </div>
          </div>

          <div class="product-subtotal">
            <span>Subtotal</span>

            <strong id="subtotal-${product.id}">
              Rs. ${formatNumber(
                product.price * orderQuantities[product.id]
              )}
            </strong>
          </div>
        </div>
      `
    )
    .join("");
}

/* Increase quantity */

function increaseQuantity(productId) {
  if (!Object.prototype.hasOwnProperty.call(orderQuantities, productId)) {
    return;
  }

  orderQuantities[productId] += 1;

  updateOrderDisplay(productId);
}

/* Decrease quantity */

function decreaseQuantity(productId) {
  if (!Object.prototype.hasOwnProperty.call(orderQuantities, productId)) {
    return;
  }

  if (orderQuantities[productId] > 0) {
    orderQuantities[productId] -= 1;
  }

  updateOrderDisplay(productId);
}

/* Update the selected quantity and subtotal */

function updateOrderDisplay(productId) {
  const product = products.find((item) => item.id === productId);

  if (!product) {
    return;
  }

  const quantityElement = document.getElementById(
    `quantity-${productId}`
  );

  const subtotalElement = document.getElementById(
    `subtotal-${productId}`
  );

  if (quantityElement) {
    quantityElement.textContent = orderQuantities[productId];
  }

  if (subtotalElement) {
    const subtotal = product.price * orderQuantities[productId];

    subtotalElement.textContent = `Rs. ${formatNumber(subtotal)}`;
  }

  updateOrderSummary();
}

/* Calculate selected items and total price */

function updateOrderSummary() {
  let selectedItems = 0;
  let totalPrice = 0;

  products.forEach((product) => {
    const quantity = orderQuantities[product.id];

    selectedItems += quantity;
    totalPrice += product.price * quantity;
  });

  const countElement = document.getElementById("selectedItemsCount");
  const totalElement = document.getElementById("orderTotal");

  if (countElement) {
    countElement.textContent = selectedItems;
  }

  if (totalElement) {
    totalElement.textContent = `Rs. ${formatNumber(totalPrice)}`;
  }
}

/* Open order modal */

function openOrderModal() {
  const modal = document.getElementById("orderModal");

  if (!modal) {
    return;
  }

  renderOrderProducts();
  updateOrderSummary();

  modal.classList.add("show");
  document.body.classList.add("modal-open");
}

/* Close order modal */

function closeOrderModal() {
  const modal = document.getElementById("orderModal");

  if (!modal) {
    return;
  }

  modal.classList.remove("show");
  document.body.classList.remove("modal-open");

  clearWarning();
}

/* Return only products whose quantity is greater than zero */

function getSelectedProducts() {
  return products
    .filter((product) => orderQuantities[product.id] > 0)
    .map((product) => ({
      ...product,
      quantity: orderQuantities[product.id],
      subtotal: product.price * orderQuantities[product.id]
    }));
}

/* Validate and send the complete order to WhatsApp */

function sendCompleteOrder() {
  const customerName = document
    .getElementById("customerName")
    .value.trim();

  const customerPhone = document
    .getElementById("customerPhone")
    .value.trim();

  const customerAddress = document
    .getElementById("customerAddress")
    .value.trim();

  const customerNote = document
    .getElementById("customerNote")
    .value.trim();

  const selectedProducts = getSelectedProducts();

  if (selectedProducts.length === 0) {
    showWarning("Please select at least one product.");
    return;
  }

  if (!customerName) {
    showWarning("Please enter your full name.");
    return;
  }

  if (!customerPhone) {
    showWarning("Please enter your contact number.");
    return;
  }

  if (!customerAddress) {
    showWarning("Please enter your delivery address.");
    return;
  }

  const phonePattern = /^[0-9+\-\s]{7,15}$/;

  if (!phonePattern.test(customerPhone)) {
    showWarning("Please enter a valid contact number.");
    return;
  }

  let totalQuantity = 0;
  let totalPrice = 0;

  const productLines = selectedProducts
    .map((product, index) => {
      totalQuantity += product.quantity;
      totalPrice += product.subtotal;

      return [
        `${index + 1}. ${product.name}`,
        `   Quantity: ${product.quantity} ${product.unit}${
          product.quantity > 1 ? "s" : ""
        }`,
        `   Price: Rs. ${formatNumber(product.price)}`,
        `   Subtotal: Rs. ${formatNumber(product.subtotal)}`
      ].join("\n");
    })
    .join("\n\n");

  const orderMessage = [
    "🛒 *NEW ORDER*",
    "*Shiva Guru Food Products*",
    "",
    "👤 *Customer Details*",
    `Name: ${customerName}`,
    `Contact: ${customerPhone}`,
    `Address: ${customerAddress}`,
    "",
    "📦 *Ordered Products*",
    productLines,
    "",
    "----------------------------",
    `Total Items: ${totalQuantity}`,
    `Total Price: Rs. ${formatNumber(totalPrice)}`,
    "----------------------------",
    "",
    `Additional Note: ${customerNote || "No additional note"}`,
    "",
    "Please confirm the order and delivery details."
  ].join("\n");

  /*
    WhatsApp business number:
    Nepal country code 977 + phone number.
  */

  const businessWhatsAppNumber = "9779855080884";

  const whatsappUrl =
    `https://wa.me/${businessWhatsAppNumber}` +
    `?text=${encodeURIComponent(orderMessage)}`;

  clearWarning();

  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
}

/* Warning message */

function showWarning(message) {
  const warningElement = document.getElementById("orderWarning");

  if (!warningElement) {
    return;
  }

  warningElement.textContent = message;
}

/* Clear warning */

function clearWarning() {
  const warningElement = document.getElementById("orderWarning");

  if (!warningElement) {
    return;
  }

  warningElement.textContent = "";
}

/* Format price with commas */

function formatNumber(number) {
  return Number(number).toLocaleString("en-IN");
}

/* Close modal by clicking outside */

window.addEventListener("click", (event) => {
  const modal = document.getElementById("orderModal");

  if (event.target === modal) {
    closeOrderModal();
  }
});

/* Close modal using Escape key */

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeOrderModal();
  }
});

/* Load products when page opens */

document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  renderOrderProducts();
  updateOrderSummary();
});
/* =========================================================
   MULTI-PAGE ORDER LINK
========================================================= */

/*
  When a customer visits products.html#order,
  automatically open the order form.
*/

function openOrderFromPageLink() {
  const orderModal = document.getElementById("orderModal");

  if (window.location.hash === "#order" && orderModal) {
    openOrderModal();
  }
}

/* =========================================================
   CUSTOMER REVIEWS
========================================================= */

const defaultReviews = [
  {
    name: "Ramesh Sharma",
    rating: 5,
    review:
      "The products were fresh, hygienically packed and delivered carefully.",
    date: "Verified Customer"
  },
  {
    name: "Sita Chaudhary",
    rating: 5,
    review:
      "Very good quality and excellent service. I would happily order again.",
    date: "Verified Customer"
  },
  {
    name: "Anil Thapa",
    rating: 4,
    review:
      "The ordering process was simple and the product quality was very good.",
    date: "Verified Customer"
  }
];

function getSavedReviews() {
  try {
    const savedReviews = localStorage.getItem("shivaGuruReviews");

    if (!savedReviews) {
      return [];
    }

    const parsedReviews = JSON.parse(savedReviews);

    return Array.isArray(parsedReviews) ? parsedReviews : [];
  } catch (error) {
    console.error("Could not load customer reviews:", error);
    return [];
  }
}

function saveReviews(reviews) {
  try {
    localStorage.setItem(
      "shivaGuruReviews",
      JSON.stringify(reviews)
    );
  } catch (error) {
    console.error("Could not save customer review:", error);
  }
}

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function createStarRating(rating) {
  const safeRating = Math.max(1, Math.min(5, Number(rating)));

  return "★".repeat(safeRating) + "☆".repeat(5 - safeRating);
}

function renderReviews() {
  const reviewList = document.getElementById("reviewList");

  if (!reviewList) {
    return;
  }

  const customerReviews = getSavedReviews();
  const allReviews = [...customerReviews, ...defaultReviews];

  reviewList.innerHTML = allReviews
    .map(
      (review) => `
        <article class="review-card">
          <div
            class="review-stars"
            aria-label="${Number(review.rating)} out of 5 stars"
          >
            ${createStarRating(review.rating)}
          </div>

          <blockquote>
            “${escapeHTML(review.review)}”
          </blockquote>

          <div class="review-customer">
            <strong>${escapeHTML(review.name)}</strong>
            <span>${escapeHTML(review.date)}</span>
          </div>
        </article>
      `
    )
    .join("");
}

function submitReview(event) {
  event.preventDefault();

  const reviewNameInput = document.getElementById("reviewName");
  const reviewRatingInput = document.getElementById("reviewRating");
  const reviewTextInput = document.getElementById("reviewText");
  const reviewMessage = document.getElementById("reviewMessage");

  if (
    !reviewNameInput ||
    !reviewRatingInput ||
    !reviewTextInput ||
    !reviewMessage
  ) {
    return;
  }

  const customerName = reviewNameInput.value.trim();
  const customerRating = Number(reviewRatingInput.value);
  const customerReview = reviewTextInput.value.trim();

  if (!customerName || !customerRating || !customerReview) {
    reviewMessage.textContent =
      "Please complete your name, rating and review.";

    return;
  }

  if (customerRating < 1 || customerRating > 5) {
    reviewMessage.textContent =
      "Please choose a rating between 1 and 5.";

    return;
  }

  const newReview = {
    name: customerName,
    rating: customerRating,
    review: customerReview,
    date: new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric"
    })
  };

  const savedReviews = getSavedReviews();

  savedReviews.unshift(newReview);

  saveReviews(savedReviews);

  renderReviews();

  event.target.reset();

  reviewMessage.textContent =
    "Thank you! Your review has been added.";

  window.setTimeout(() => {
    reviewMessage.textContent = "";
  }, 5000);
}

/* =========================================================
   PAGE INITIALISATION
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  openOrderFromPageLink();
  renderReviews();

  const reviewForm = document.getElementById("reviewForm");

  if (reviewForm) {
    reviewForm.addEventListener("submit", submitReview);
  }
});
