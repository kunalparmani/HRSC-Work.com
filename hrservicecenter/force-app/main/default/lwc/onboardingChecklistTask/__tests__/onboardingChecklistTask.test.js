import { createElement } from "lwc";
import OnboardingChecklistTask from "../onboardingChecklistTask";

const TASK_SERVICE_SUCCESS_DATA = require("../../taskService/__tests__/data/taskServiceSuccessData.json");

describe("c-onboarding-checklist-task", () => {
    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        jest.clearAllMocks();
    });

    it("sets additional .task-card-body-label CSS classes if the task has description set and is marked as completed", () => {
        const task = JSON.parse(
            JSON.stringify(TASK_SERVICE_SUCCESS_DATA.APEX_GET_TASKS[0])
        );
        task.completed = true;

        const element = createElement("c-onboarding-checklist", {
            is: OnboardingChecklistTask
        });
        element.task = task;
        document.body.appendChild(element);

        return Promise.resolve().then(() => {
            const taskCardBodyLabelElement = element.shadowRoot.querySelector(
                "div.task-card-body-label"
            );

            expect(taskCardBodyLabelElement.classList).toContain(
                "slds-m-bottom_xx-small"
            );
            expect(taskCardBodyLabelElement.classList).toContain("completed");
        });
    });

    it("does not set additional .task-card-body-label CSS classes if the task has description set and is marked as completed", () => {
        const task = JSON.parse(
            JSON.stringify(TASK_SERVICE_SUCCESS_DATA.APEX_GET_TASKS[0])
        );
        task.description = null;

        const element = createElement("c-onboarding-checklist", {
            is: OnboardingChecklistTask
        });
        element.task = task;
        document.body.appendChild(element);

        return Promise.resolve().then(() => {
            const taskCardBodyLabelElement = element.shadowRoot.querySelector(
                "div.task-card-body-label"
            );

            expect(taskCardBodyLabelElement.classList).not.toContain(
                "slds-m-bottom_xx-small"
            );
            expect(taskCardBodyLabelElement.classList).not.toContain(
                "completed"
            );
        });
    });

    it("sets additional .task-card CSS classes if the task is not the last on the list and is selected", () => {
        const task = JSON.parse(
            JSON.stringify(TASK_SERVICE_SUCCESS_DATA.APEX_GET_TASKS[0])
        );

        const element = createElement("c-onboarding-checklist", {
            is: OnboardingChecklistTask
        });
        element.isLast = false;
        element.task = task;
        element.selected = true;
        document.body.appendChild(element);

        return Promise.resolve().then(() => {
            const taskCardElement = element.shadowRoot.querySelector(
                "article.task-card"
            );
            expect(taskCardElement.classList).toContain("slds-m-bottom_small");
            expect(taskCardElement.classList).toContain("selected");
        });
    });

    it("does not set additional .task-card CSS classes if the task is not the last on the list and is selected", () => {
        const task = JSON.parse(
            JSON.stringify(TASK_SERVICE_SUCCESS_DATA.APEX_GET_TASKS[0])
        );

        const element = createElement("c-onboarding-checklist", {
            is: OnboardingChecklistTask
        });
        element.isLast = true;
        element.task = task;
        element.selected = false;
        document.body.appendChild(element);

        return Promise.resolve().then(() => {
            const taskCardElement = element.shadowRoot.querySelector(
                "article.task-card"
            );
            expect(taskCardElement.classList).not.toContain(
                "slds-m-bottom_small"
            );
            expect(taskCardElement.classList).not.toContain("selected");
        });
    });

    it("renders the proper content if task data is available", () => {
        const task = JSON.parse(
            JSON.stringify(TASK_SERVICE_SUCCESS_DATA.APEX_GET_TASKS[0])
        );

        const element = createElement("c-onboarding-checklist", {
            is: OnboardingChecklistTask
        });
        element.task = task;
        document.body.appendChild(element);

        return Promise.resolve().then(() => {
            const labelElement = element.shadowRoot.querySelector(
                "article.task-card .task-card-body .task-card-body-label .label a"
            );
            expect(labelElement.textContent).toBe(task.label);

            const descriptionElement = element.shadowRoot.querySelector(
                "article.task-card .task-card-body .task-card-body-description"
            );
            expect(descriptionElement.textContent).toBe(task.description);
        });
    });

    it("fires the 'selecttask' event on task wrapper element click event", () => {
        const task = JSON.parse(
            JSON.stringify(TASK_SERVICE_SUCCESS_DATA.APEX_GET_TASKS[0])
        );

        const element = createElement("c-onboarding-checklist", {
            is: OnboardingChecklistTask
        });
        element.task = task;
        document.body.appendChild(element);

        const selectTaskEventHandler = jest.fn();
        element.addEventListener("selecttask", selectTaskEventHandler);

        return Promise.resolve().then(() => {
            const labelElement = element.shadowRoot.querySelector(
                "article.task-card .task-card-body .task-card-body-label .label a"
            );
            const clickEvent = new CustomEvent("click");
            labelElement.dispatchEvent(clickEvent);

            expect(selectTaskEventHandler).toHaveBeenCalled();
            expect(
                selectTaskEventHandler.mock.calls[0][0].detail.flowName
            ).toBe(task.flowName);
        });
    });
});
