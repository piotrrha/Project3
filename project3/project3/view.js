const View = {
  templates: {},

  initTemplates() {
    this.templates.home = Handlebars.compile(
      document.getElementById("home-template").innerHTML
    );
    this.templates.step = Handlebars.compile(
      document.getElementById("step-template").innerHTML
    );
    this.templates.confirmation = Handlebars.compile(
      document.getElementById("confirmation-template").innerHTML
    );
    this.templates.feedback = Handlebars.compile(
      document.getElementById("feedback-template").innerHTML
    );
    this.templates.final = Handlebars.compile(
      document.getElementById("final-template").innerHTML
    );
  },

  renderHome(burgers) {
    const app = document.getElementById("app");
    app.innerHTML = this.templates.home({ burgers });
  },

  renderStep(step) {
    const app = document.getElementById("app");

    const data = {
      title: step.title,
      prompt: step.prompt,
      options: step.options || [],
      placeholder: step.placeholder || "",
      isButtonStep: step.inputType === "buttons",
      isTextStep: step.inputType === "text",
      isImageStep: step.inputType === "images"
    };

    app.innerHTML = this.templates.step(data);
  },

  renderConfirmation(message) {
    const app = document.getElementById("app");
    app.innerHTML = this.templates.confirmation({ message });
  },

  renderFeedback(message) {
    const app = document.getElementById("app");
    app.innerHTML = this.templates.feedback({ message });
  },

  renderFinal(name, skipped, order) {
    const app = document.getElementById("app");

    const message = skipped
      ? `Oops, ${name}! You skipped a few steps. Want to try again?`
      : `Thank you, ${name}! Your burger is on the grill!`;

    app.innerHTML = this.templates.final({
      message,
      order
    });
  },

  updateSummary(state) {
    document.getElementById("summaryName").textContent = state.name || "-";
    document.getElementById("summaryBase").textContent = state.order.base || "-";
    document.getElementById("summaryBun").textContent = state.order.bun || "-";
    document.getElementById("summaryProtein").textContent = state.order.protein || "-";
    document.getElementById("summaryToppings").textContent = state.order.toppings || "-";
    document.getElementById("summarySauces").textContent = state.order.sauces || "-";
    document.getElementById("summaryExtras").textContent = state.order.extras || "-";
  }
};