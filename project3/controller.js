const Controller = {

    async startApp() {

        View.render("#start-template");

        document
        .querySelector("#name-form")
        .addEventListener("submit", this.handleNameSubmit);

    },


    async handleNameSubmit(e) {

        e.preventDefault();

        const name =
        document.querySelector("#customer-name").value;

        Model.state.name = name;

        const burgers =
        await Model.fetchBurgers();

        View.render("#menu-template", {
            name,
            burgers
        });

        document
        .querySelectorAll(".select-burger-btn")
        .forEach(btn =>
            btn.addEventListener(
                "click",
                Controller.handleBurgerSelect
            )
        );

    },


    async handleBurgerSelect(e) {

        const id = e.target.dataset.id;

        await Model.loadBurgerSteps(id);

        View.renderSummary(Model.state);

        Controller.loadStep();

    },


    loadStep() {

        const step =
        Model.state.steps[
            Model.state.currentStepIndex
        ];

        if (!step) {
            Controller.finishOrder();
            return;
        }

        step.isMultipleChoice =
        step.type === "multiple-choice";

        step.isText =
        step.type === "text";

        step.isImageSelection =
        step.type === "image-selection";

        View.render("#step-template", step);

        Controller.attachStepHandlers(step);

    },


    attachStepHandlers(step) {

        if (step.type === "multiple-choice") {

            document
            .querySelectorAll(".choice-btn")
            .forEach(btn =>
                btn.addEventListener(
                    "click",
                    () =>
                    Controller.processSelection(
                        step,
                        btn.dataset.value
                    )
                )
            );

        }


        if (step.type === "text") {

            document
            .querySelector("#text-step-form")
            .addEventListener(
                "submit",
                e => {

                    e.preventDefault();

                    const value =
                    document.querySelector("#text-answer").value;

                    Controller.processSelection(
                        step,
                        value
                    );

                }
            );

        }


        if (step.type === "image-selection") {

            document
            .querySelectorAll(".image-choice-btn")
            .forEach(btn =>
                btn.addEventListener(
                    "click",
                    () =>
                    Controller.processSelection(
                        step,
                        btn.dataset.value
                    )
                )
            );

        }

    },


    processSelection(step, value) {

        Model.saveSelection(step.id, value);

        View.renderSummary(Model.state);

        if (step.feedback &&
            value > 3) {

            Controller.showFeedback(
                step.feedback.message
            );

            return;

        }

        Controller.showConfirmation();

    },


    showConfirmation() {

        View.render(
            "#confirmation-template",
            { message: "Great choice!" }
        );

        setTimeout(() => {

            Model.nextStep();

            Controller.loadStep();

        }, 1000);

    },


    showFeedback(message) {

        View.render(
            "#feedback-template",
            { message }
        );

        document
        .querySelector("#got-it-btn")
        .addEventListener(
            "click",
            () => {

                Model.nextStep();

                Controller.loadStep();

            }
        );

    },


    finishOrder() {

        const name =
        Model.state.name;

        View.render("#final-template", {
            finalMessage:
            `Thank you, ${name}! Your burger is on the grill!`
        });

        document
        .querySelector("#restart-btn")
        .addEventListener(
            "click",
            Controller.restart
        );

        document
        .querySelector("#home-btn")
        .addEventListener(
            "click",
            Controller.startApp
        );

    },


    restart() {

        Model.reset();

        View.renderSummary(Model.state);

        Controller.startApp();

    }

};