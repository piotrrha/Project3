const state = {
  burgers: [],
  selectedBurger: null,
  cart: [],
  paymentMethod: null,
  orderNumber: null,
  orders: []
};

async function loadBurgers() {
  const response = await fetch("burgers.json");
  if (!response.ok) {
    throw new Error("Could not load burgers.json");
  }
  state.burgers = await response.json();
}

function getBurgerById(id) {
  return state.burgers.find((burger) => Number(burger.id) === Number(id)) || null;
}

function setSelectedBurger(id) {
  state.selectedBurger = getBurgerById(id);
}

function addSelectedBurgerToCart(customization) {
  if (!state.selectedBurger) return;

  const basePrice = Number(state.selectedBurger.price);
  let extra = 0;

  if (customization.bacon) extra += 2.0;
  if (customization.doublePatty) extra += 3.5;

  const quantity = Math.max(1, Number(customization.quantity) || 1);
  const unitPrice = basePrice + extra;
  const lineTotal = unitPrice * quantity;

  const cartItem = {
    id: Date.now(),
    burgerId: state.selectedBurger.id,
    name: state.selectedBurger.name,
    image: state.selectedBurger.image,
    quantity,
    noOnions: Boolean(customization.noOnions),
    noTomatoes: Boolean(customization.noTomatoes),
    noMayo: Boolean(customization.noMayo),
    bacon: Boolean(customization.bacon),
    doublePatty: Boolean(customization.doublePatty),
    unitPrice,
    lineTotal
  };

  state.cart.push(cartItem);
}

function removeCartItem(itemId) {
  state.cart = state.cart.filter((item) => Number(item.id) !== Number(itemId));
}

function clearCart() {
  state.cart = [];
}

function getCartSubtotal() {
  return state.cart.reduce((sum, item) => sum + item.lineTotal, 0);
}

function getCartTax() {
  return getCartSubtotal() * 0.08;
}

function getCartTotal() {
  return getCartSubtotal() + getCartTax();
}

function getCartCount() {
  return state.cart.reduce((sum, item) => sum + item.quantity, 0);
}

function getReviewData() {
  return {
    cart: state.cart.map((item) => ({
      ...item,
      lineTotal: item.lineTotal.toFixed(2)
    })),
    itemCount: getCartCount(),
    subtotal: getCartSubtotal().toFixed(2),
    tax: getCartTax().toFixed(2),
    total: getCartTotal().toFixed(2)
  };
}

function setPaymentMethod(method) {
  state.paymentMethod = method;
}

function createOrderRecord(customerName = "Guest") {
  const orderNumber = Math.floor(1000 + Math.random() * 9000);

  const order = {
    orderNumber,
    customerName,
    items: state.cart.map((item) => ({ ...item })),
    total: getCartTotal().toFixed(2),
    status: "queued"
  };

  state.orderNumber = orderNumber;
  state.orders.push(order);
}

function markOrderComplete(orderNumber) {
  state.orders = state.orders.filter(
    (order) => Number(order.orderNumber) !== Number(orderNumber)
  );
}

function resetCurrentOrderFlow() {
  state.selectedBurger = null;
  state.cart = [];
  state.paymentMethod = null;
  state.orderNumber = null;
}