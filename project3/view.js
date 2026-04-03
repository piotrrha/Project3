const View = {
  render(templateId, data = {}, targetSelector = "#app") {
    const templateSource = document.querySelector(templateId).innerHTML;
    const template = Handlebars.compile(templateSource);
    const html = template(data);

    document.querySelector(targetSelector).innerHTML = html;
  },

  renderStartScreen() {
    this.render("#start-template");
  },

  renderMenuScreen(name, burgers) {
    this.render("#menu-template", {
      name: name,
      burgers: burgers
    });
  },

  renderStepScreen(step) {
    const stepData = {
      ...step,
      isMultipleChoice: step.type === "multiple-choice",
      isText: step.type === "text",
      isImageSelection: step.type === "image-selection"
    };

    this.render("#step-template", stepData);
  },

  renderConfirmation(message) {
    this.render("#confirmation-template", { message: message });
  },

  renderFeedback(message) {
    this.render("#feedback-template", { message: message });
  },

  renderFinal(finalMessage) {
    this.render("#final-template", { finalMessage: finalMessage });
  },

  renderSummary(state) {
    this.render(
      "#summary-template",
      {
        name: state.name || "—",
        burgerBase: state.burgerBase || "—",
        selections: state.selections || []
      },
      "#summary-panel"
    );
  },

  showError(message) {
    document.querySelector("#app").innerHTML = `
      <div class="text-center py-5">
        <h2 class="text-danger">Something went wrong</h2>
        <p class="mt-3">${message}</p>
      </div>
    `;
  }
};