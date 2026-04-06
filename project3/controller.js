const Controller = {
  burgers: [],
  feedbackRules: [],

  async init() {
    try {
      View.initTemplates();
      this.burgers = await Model.fetchBurgers();
      this.feedbackRules = await Model.fetchFeedbackRules();
      View.renderHome(this.burgers);
      View.updateSummary(Model.state);
      this.bindHomeEvents();
    } catch (error) {
      document.getElementById("app").innerHTML = `
        <div class="alert alert-danger">
          Error loading app: ${error.message}
        </div>
      `;
    }
  },

  bindHomeEvents() {
    const startForm = document.getElementById("startForm");
    const burgerButtons = document.querySelectorAll(".select-burger-btn");

    if (startForm) {
      startForm.addEventListener("submit", (e) => {
        e.preventDefault();
      });
    }

    burgerButtons.forEach((button) => {
      button.addEventListener("click", async (e) => {
        const burgerId = Number(e.target.dataset.id);
        const nameInput = document.getElementById("customerName");
        const customerName = nameInput.value.trim();

        if (!customerName) {
          alert("Please enter your name first.");
          return;
        }

        const selectedBurger = this.burgers.find((b) => b.id === burgerId);

        Model.setCustomerName(customerName);
        Model.setBurger(selectedBurger);
        View.updateSummary(Model.state);

        try {
          const steps = await Model.fetchSteps(burgerId);
          Model.setSteps(steps);
          this.showCurrentStep();
        } catch (error) {
          document.getElementById("app").innerHTML = `
            <div class="alert alert-danger">
              Error loading burger steps.
            </div>
          `;
        }
      });
    });
  },

  showCurrentStep() {
    if (!Model.hasMoreSteps()) {
      View.renderFinal(Model.state.name, Model.state.skipped, Model.state.order);
      this.bindFinalEvents();
      return;
    }

    const currentStep = Model.getCurrentStep();
    View.renderStep(currentStep);
    View.updateSummary(Model.state);
    this.bindStepEvents(currentStep);
  },

  bindStepEvents(step) {
    const optionButtons = document.querySelectorAll(".option-btn");
    const imageButtons = document.querySelectorAll(".option-image-btn");
    const textForm = document.getElementById("textStepForm");
    const skipButton = document.getElementById("skipStepBtn");

    optionButtons.forEach((button) => {
      button.addEventListener("click", async (e) => {
        const value = e.target.dataset.value;
        await this.handleStepAnswer(step, value);
      });
    });

    imageButtons.forEach((card) => {
      card.addEventListener("click", async (e) => {
        const selectedCard = e.currentTarget;
        const value = selectedCard.dataset.value;
        await this.handleStepAnswer(step, value);
      });
    });

    if (textForm) {
      textForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const input = document.getElementById("textStepInput");
        const value = input.value.trim();

        if (!value) {
          alert("Please enter a value.");
          return;
        }

        await this.handleStepAnswer(step, value);
      });
    }

    if (skipButton) {
      skipButton.addEventListener("click", () => {
        Model.markSkipped();
        Model.nextStep();
        this.showCurrentStep();
      });
    }
  },

  async handleStepAnswer(step, value) {
    Model.saveStepAnswer(step.key, value);
    View.updateSummary(Model.state);

    const feedbackMessage = this.getFeedbackMessage();

    if (feedbackMessage) {
      View.renderFeedback(feedbackMessage);
      const gotItBtn = document.getElementById("gotItBtn");
      gotItBtn.addEventListener("click", () => {
        Model.nextStep();
        this.showCurrentStep();
      });
      return;
    }

    View.renderConfirmation(step.confirmation || "Great choice!");

    setTimeout(() => {
      Model.nextStep();
      this.showCurrentStep();
    }, 1000);
  },

  getFeedbackMessage() {
    const bun = Model.state.order.bun;
    const sauces = Model.state.order.sauces;

    for (let i = 0; i < this.feedbackRules.length; i++) {
      const rule = this.feedbackRules[i];

      if (rule.bun === bun && rule.sauce === sauces) {
        return rule.message;
      }
    }

    return null;
  },

  bindFinalEvents() {
    const restartBtn = document.getElementById("restartOrderBtn");
    const homeBtn = document.getElementById("goHomeBtn");

    if (restartBtn) {
      restartBtn.addEventListener("click", async () => {
        const currentName = Model.state.name;
        const currentBurgerId = Model.state.selectedBurgerId;
        const selectedBurger = this.burgers.find((b) => b.id === currentBurgerId);

        Model.state.steps = [];
        Model.state.currentStepIndex = 0;
        Model.state.skipped = false;
        Model.state.order = {
          base: selectedBurger ? selectedBurger.name : "",
          bun: "",
          protein: "",
          toppings: "",
          sauces: "",
          extras: "",
          presentation: ""
        };
        Model.state.name = currentName;
        Model.state.selectedBurgerId = currentBurgerId;
        Model.state.selectedBurgerName = selectedBurger ? selectedBurger.name : "";

        try {
          const steps = await Model.fetchSteps(currentBurgerId);
          Model.setSteps(steps);
          Model.state.name = currentName;
          Model.state.order.base = selectedBurger.name;
          View.updateSummary(Model.state);
          this.showCurrentStep();
        } catch (error) {
          alert("Could not restart order.");
        }
      });
    }

    if (homeBtn) {
      homeBtn.addEventListener("click", () => {
        Model.resetState();
        View.renderHome(this.burgers);
        View.updateSummary(Model.state);
        this.bindHomeEvents();
      });
    }
  }
};

document.addEventListener("DOMContentLoaded", () => {
  Controller.init();
});