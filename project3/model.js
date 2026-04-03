const API_URL =
"https://my-json-server.typicode.com/YOUR-USERNAME/YOUR-REPO";

const Model = {

    state: {
        name: "",
        burgerBase: "",
        steps: [],
        currentStepIndex: 0,
        selections: []
    },

    async fetchBurgers() {
        const res = await fetch(`${API_URL}/burgers`);
        return await res.json();
    },

    async loadBurgerSteps(id) {
        const res = await fetch(`${API_URL}/burgers/${id}`);
        const data = await res.json();

        this.state.steps = data.steps;
        this.state.burgerBase = data.title;
        this.state.currentStepIndex = 0;
    },

    saveSelection(stepId, value) {

        this.state.selections.push({
            step: stepId,
            value: value
        });

    },

    nextStep() {
        this.state.currentStepIndex++;
    },

    reset() {
        this.state = {
            name: "",
            burgerBase: "",
            steps: [],
            currentStepIndex: 0,
            selections: []
        };
    }

};