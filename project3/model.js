const API_BASE = "https://my-json-server.typicode.com/YOUR-GITHUB-USERNAME/YOUR-REPO-NAME";

const Model = {
  state: {
    name: "",
    selectedBurgerId: null,
    selectedBurgerName: "",
    steps: [],
    currentStepIndex: 0,
    skipped: false,
    order: {
      base: "",
      bun: "",
      protein: "",
      toppings: "",
      sauces: "",
      extras: "",
      presentation: ""
    }
  },

  async fetchBurgers() {
    const response = await fetch(`${API_BASE}/burgers`);
    if (!response.ok) {
      throw new Error("Could not load burgers.");
    }
    return await response.json();
  },

  async fetchSteps(burgerId) {
    const response = await fetch(`${API_BASE}/steps?burgerId=${burgerId}`);
    if (!response.ok) {
      throw new Error("Could not load customization steps.");
    }
    return await response.json();
  },

  async fetchFeedbackRules() {
    const response = await fetch(`${API_BASE}/feedbackRules`);
    if (!response.ok) {
      return [];
    }
    return await response.json();
  },

  setCustomerName(name) {
    this.state.name = name;
  },

  setBurger(burger) {
    this.state.selectedBurgerId = burger.id;
    this.state.selectedBurgerName = burger.name;
    this.state.order.base = burger.name;
  },

  setSteps(steps) {
    this.state.steps = steps;
    this.state.currentStepIndex = 0;
  },

  getCurrentStep() {
    return this.state.steps[this.state.currentStepIndex];
  },

  saveStepAnswer(stepKey, value) {
    this.state.order[stepKey] = value;
  },

  nextStep() {
    this.state.currentStepIndex++;
  },

  hasMoreSteps() {
    return this.state.currentStepIndex < this.state.steps.length;
  },

  markSkipped() {
    this.state.skipped = true;
  },

  resetState() {
    this.state.name = "";
    this.state.selectedBurgerId = null;
    this.state.selectedBurgerName = "";
    this.state.steps = [];
    this.state.currentStepIndex = 0;
    this.state.skipped = false;
    this.state.order = {
      base: "",
      bun: "",
      protein: "",
      toppings: "",
      sauces: "",
      extras: "",
      presentation: ""
    };
  }
};