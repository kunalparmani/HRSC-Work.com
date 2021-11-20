import { createElement } from "lwc";
import getTasks from "@salesforce/apex/OnboardingChecklist.getTasks";
import hasOnboardingAccess from "@salesforce/apex/OnboardingFeatureAccess.hasOnboardingAccess";
import OnboardingChecklist from "c/onboardingChecklist";
import { publish, subscribe, MessageContext } from "lightning/messageService";
import DFMC from "@salesforce/messageChannel/onboardingChecklist__c";
import { registerTestWireAdapter } from "@salesforce/sfdx-lwc-jest";

const TASK_SERVICE_SUCCESS_DATA = require("../../taskService/__tests__/data/taskServiceSuccessData.json");

const messageContextWireAdapter = registerTestWireAdapter(MessageContext);

jest.mock(
    "@salesforce/apex/OnboardingChecklist.getTasks",
    () => {
        return {
            default: jest.fn()
        };
    },
    { virtual: true }
);

jest.mock(
    "@salesforce/apex/OnboardingFeatureAccess.hasOnboardingAccess",
    () => {
        return {
            default: jest.fn()
        };
    },
    { virtual: true }
);

describe("c-onboarding-checklist", () => {
    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        jest.clearAllMocks();
    });

    function flushPromises() {
        // eslint-disable-next-line no-undef
        return new Promise((resolve) => setImmediate(resolve));
    }

    it("does not render list element if tasks data is empty", () => {
        hasOnboardingAccess.mockResolvedValue(true);
        const element = createElement("c-onboarding-checklist", {
            is: OnboardingChecklist
        });
        document.body.appendChild(element);

        return flushPromises().then(() => {
            const listElement = element.shadowRoot.querySelector(
                "p.tasks-list"
            );
            expect(listElement).toBeNull();
        });
    });

    it("renders list element if tasks data exists", () => {
        hasOnboardingAccess.mockResolvedValue(true);
        getTasks.mockResolvedValue(TASK_SERVICE_SUCCESS_DATA.APEX_GET_TASKS);

        const element = createElement("c-welcome-task", {
            is: OnboardingChecklist
        });
        document.body.appendChild(element);

        return flushPromises().then(() => {
            const listElement = element.shadowRoot.querySelector(
                "p.tasks-list"
            );
            expect(listElement).not.toBeNull();

            const tasksElements = element.shadowRoot.querySelectorAll(
                "c-onboarding-checklist-task"
            );
            expect(tasksElements.length).not.toBe(0);
        });
    });

    it("updates task selection on task click event", () => {
        hasOnboardingAccess.mockResolvedValue(true);
        getTasks.mockResolvedValue(TASK_SERVICE_SUCCESS_DATA.APEX_GET_TASKS);

        const element = createElement("c-onboarding-checklist", {
            is: OnboardingChecklist
        });
        document.body.appendChild(element);

        const taskDetails = {
            taskId: TASK_SERVICE_SUCCESS_DATA.APEX_GET_TASKS[0].taskId,
            flowAPIName: TASK_SERVICE_SUCCESS_DATA.APEX_GET_TASKS[0].flowAPIName
        };
        window.location.hash = taskDetails.taskId;

        return flushPromises().then(() => {
            const tasksElements = element.shadowRoot.querySelectorAll(
                "c-onboarding-checklist-task"
            );
            const clickEvent = new CustomEvent("selecttask", {
                detail: taskDetails
            });
            tasksElements[0].dispatchEvent(clickEvent);
            expect(tasksElements[0].selected).toBe(true);
            expect(tasksElements[1].selected).toBe(false);
            expect(window.location.hash).toContain(taskDetails.taskId);
        });
    });

    it("does not update task selection after fetching tasks if no flow name is present in the URL", () => {
        hasOnboardingAccess.mockResolvedValue(true);
        getTasks.mockResolvedValue(TASK_SERVICE_SUCCESS_DATA.APEX_GET_TASKS);

        window.location.hash = "";

        const element = createElement("c-onboarding-checklist", {
            is: OnboardingChecklist
        });
        document.body.appendChild(element);

        return flushPromises().then(() => {
            const tasksElements = element.shadowRoot.querySelectorAll(
                "c-onboarding-checklist-task"
            );

            const taskElementsList = Array.prototype.map.call(
                tasksElements,
                ({ selected, isLast, task }) => ({
                    selected,
                    isLast,
                    task
                })
            );

            const areAnyTasksSelected = taskElementsList.reduce(
                (value, task) => {
                    return value && task.selected;
                },
                false
            );

            expect(areAnyTasksSelected).toBe(false);
        });
    });

    it("does invoke getTasks method if messageChannel event object is not falsy", () => {
        hasOnboardingAccess.mockResolvedValue(true);
        getTasks.mockResolvedValue(TASK_SERVICE_SUCCESS_DATA.APEX_GET_TASKS);

        const element = createElement("c-onboarding-checklist", {
            is: OnboardingChecklist
        });
        document.body.appendChild(element);

        publish(messageContextWireAdapter, DFMC, {
            type: "FlowStatusChange"
        });

        return flushPromises().then(() => {
            const tasksElements = element.shadowRoot.querySelectorAll(
                "c-onboarding-checklist-task"
            );
            expect(subscribe).toHaveBeenCalled();
            expect(tasksElements.length).toBe(2);
        });
    });

    it("does not invoke getTasks method if messageChannel event object is falsy", () => {
        hasOnboardingAccess.mockResolvedValue(true);
        getTasks.mockResolvedValue(TASK_SERVICE_SUCCESS_DATA.APEX_GET_TASKS);

        const element = createElement("c-onboarding-checklist", {
            is: OnboardingChecklist
        });
        document.body.appendChild(element);

        publish(messageContextWireAdapter, DFMC, {
            type: null
        });

        return flushPromises().then(() => {
            const tasksElements = element.shadowRoot.querySelectorAll(
                "c-onboarding-checklist-task"
            );
            expect(subscribe).toHaveBeenCalled();
            expect(tasksElements.length).toBe(2);
        });
    });

    it("does not render the outermost container element if the license is not available", () => {
        hasOnboardingAccess.mockResolvedValue(false);

        const element = createElement("c-onboarding-checklist", {
            is: OnboardingChecklist
        });
        document.body.appendChild(element);

        return flushPromises().then(() => {
            const contentElement = element.shadowRoot.querySelector(
                "lightning-card"
            );
            expect(contentElement).toBeNull();
        });
    });
});
