const whatsappNumber = "9779845094574";

const products = [
  {
    name: "Himal-5kg",
    price: "Rs. 250",
    image: "images/arnav.png",
    description: "Traditional homemade taste with handpicked ingredients and perfect blend of spices."
  },
  {
    name: "Himal-200gm",
    price: "Rs. 1200",
    image: "images/arnav2.png",
    description: "Made from pure milk with rich aroma, traditional quality and pure nutrition."
  },
  {
    name: "Himal-150gm",
    price: "Rs. 180",
    image: "images/arnav3.png",
    description: "Authentic spice blend that enhances the taste of your everyday meals."
  },
  {
    name: "Sonam-150gm",
    price: "Rs. 650",
   image: "images/arnav1.png",
    description: "100% natural honey, unprocessed and packed with natural goodness."
  }
];

const productGrid = document.getElementById("productGrid");
let selectedProductName = "";
let selectedProductPrice = "";

products.forEach((product) => {
  productGrid.innerHTML += `
    <div class="product-card">
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <div class="price">${product.price}</div>
      <p>${product.description}</p>
      <button class="order-btn" onclick="openOrderModal('${product.name}', '${product.price}')">
        Order Now
      </button>
    </div>
  `;
});

function openOrderModal(productName, productPrice) {
  selectedProductName = productName;
  selectedProductPrice = productPrice;

  document.getElementById("selectedProduct").innerText =
    `${productName} - ${productPrice}`;

  document.getElementById("orderModal").style.display = "flex";
}

function closeModal() {
  document.getElementById("orderModal").style.display = "none";
}

function sendOrder() {
  const name = document.getElementById("customerName").value.trim();
  const address = document.getElementById("customerAddress").value.trim();
  const quantity = document.getElementById("quantity").value.trim();
  const phone = document.getElementById("customerPhone").value.trim();

  if (!name || !address || !quantity || !phone) {
    alert("Please fill all fields before sending order.");
    return;
  }

  const message = `
Hello Shiva Guru Food Products,

I want to place an order.

Product: ${selectedProductName}
Price: ${selectedProductPrice}
Quantity: ${quantity}

Customer Name: ${name}
Address: ${address}
Contact Number: ${phone}

Please confirm my order.
`;

  const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  window.open(whatsappURL, "_blank");
}