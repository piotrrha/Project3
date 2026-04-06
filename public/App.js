const state = {
  products: [],
  order: []
};

const menuContainer = document.getElementById("menuContainer");
const orderContainer = document.getElementById("orderContainer");
const modalRoot = document.getElementById("modalRoot");
const statusBox = document.getElementById("statusBox");

const menuTemplate = Handlebars.compile(
  document.getElementById("menu-template").innerHTML
);
const orderTemplate = Handlebars.compile(
  document.getElementById("order-template").innerHTML
);
const customizeTemplate = Handlebars.compile(
  document.getElementById("customize-template").innerHTML
);

document.getElementById("loadMenuBtn").addEventListener("click", loadMenu);
document.getElementById("clearOrderBtn").addEventListener("click", clearOrder);
document.getElementById("checkoutBtn").addEventListener("click", checkout);

async function loadMenu() {
  statusBox.textContent = "Loading burgers...";

  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/photos?_limit=8");
    const data = await response.json();

    state.products = data.map((item, index) => ({
      id: item.id,
      name: `Burger ${index + 1}`,
      description: item.title,
      image: item.url,
      price: (8.99 + index).toFixed(2)
    }));

    renderMenu();
    statusBox.textContent = "Menu loaded.";
  } catch (error) {
    console.error(error);
    statusBox.textContent = "Could not load burgers.";
  }
}

function renderMenu() {
  menuContainer.innerHTML = menuTemplate({ products: state.products });

  document.querySelectorAll(".add-btn").forEach((button) => {
    button.addEventListener("click", () => {
      openCustomizeModal({
        id: Number(button.dataset.id),
        name: button.dataset.name,
        price: Number(button.dataset.price),
        image: button.dataset.image
      });
    });
  });
}

function openCustomizeModal(product) {
  modalRoot.innerHTML = customizeTemplate(product);

  document
    .getElementById("cancelCustomize")
    .addEventListener("click", closeModal);

  document.getElementById("customForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const customizedItem = {
      id: Date.now(),
      productId: product.id,
      name: product.name,
      basePrice: product.price,
      quantity: 1,
      noOnions: formData.get("noOnions") === "on",
      noTomatoes: formData.get("noTomatoes") === "on",
      noMayo: formData.get("noMayo") === "on",
      bacon: formData.get("bacon") === "on",
      doublePatty: formData.get("doublePatty") === "on"
    };

    let extra = 0;
    if (customizedItem.bacon) extra += 2;
    if (customizedItem.doublePatty) extra += 3.5;

    customizedItem.price = Number(product.price) + extra;
    customizedItem.lineTotal = customizedItem.price.toFixed(2);

    state.order.push(customizedItem);
    closeModal();
    renderOrder();
  });
}

function closeModal() {
  modalRoot.innerHTML = "";
}

function renderOrder() {
  const subtotal = state.order.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const displayItems = state.order.map((item) => ({
    ...item,
    lineTotal: (item.price * item.quantity).toFixed(2)
  }));

  orderContainer.innerHTML = orderTemplate({
    items: displayItems,
    itemCount: state.order.length,
    subtotal: subtotal.toFixed(2),
    tax: tax.toFixed(2),
    total: total.toFixed(2)
  });

  document.querySelectorAll(".remove-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const id = Number(button.dataset.id);
      state.order = state.order.filter((item) => item.id !== id);
      renderOrder();
    });
  });
}

function clearOrder() {
  state.order = [];
  renderOrder();
  statusBox.textContent = "Order cleared.";
}

async function checkout() {
  if (!state.order.length) {
    statusBox.textContent = "Add something before checkout.";
    return;
  }

  const subtotal = state.order.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const payload = {
    items: state.order,
    subtotal: subtotal.toFixed(2),
    tax: tax.toFixed(2),
    total: total.toFixed(2)
  };

  statusBox.textContent = "Submitting order...";

  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    console.log("Order submitted:", result);

    statusBox.textContent = `Order submitted successfully. Fake order id: ${result.id}`;
    state.order = [];
    renderOrder();
  } catch (error) {
    console.error(error);
    statusBox.textContent = "Checkout failed.";
  }
}

renderOrder();
window.addEventListener("DOMContentLoaded", () => {
  renderHomeScreen();
});