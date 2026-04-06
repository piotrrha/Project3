function renderTemplate(templateId, data = {}) {
  const sourceEl = document.getElementById(templateId);

  if (!sourceEl) {
    throw new Error(`Template not found: ${templateId}`);
  }

  const template = Handlebars.compile(sourceEl.innerHTML);
  const app = document.getElementById("app");

  if (!app) {
    throw new Error("Missing #app container in index.html");
  }

  app.innerHTML = template(data);
}

function renderHomeScreen() {
  renderTemplate("home-template");
}

function renderChooseScreen() {
  renderTemplate("choose-template", {
    burgers: state.burgers
  });
}

function renderOrderScreen() {
  renderTemplate("order-template", {
    burger: state.selectedBurger
  });
}

function renderReviewScreen() {
  renderTemplate("review-template", getReviewData());
}

function renderSelectPaymentScreen() {
  renderTemplate("select-payment-template");
}

function renderPaymentScreen() {
  renderTemplate("payment-template", {
    paymentMethod: state.paymentMethod,
    total: getCartTotal().toFixed(2),
    isCard: state.paymentMethod === "Card"
  });
}

function renderQueueScreen() {
  renderTemplate("queue-template", {
    orderNumber: state.orderNumber
  });
}

function renderCompleteScreen() {
  renderTemplate("complete-template", {
    orderNumber: state.orderNumber
  });
}

function renderAdminScreen() {
  renderTemplate("admin-template", {
    orders: state.orders
  });
}