import { createElement } from "lwc";
import getTasks from "@salesforce/apex/OnboardingChecklist.getTasks";
import hasOnboardingAccess from "@salesforce/apex/OnboardingFeatureAccess.hasOnboardingAccess";
import WelcomeTask from "c/welcomeTask";

import WELCOME_TASK_HEADER_TASKS_COMPLETED from "@salesforce/label/c.Welcome_Task_Header_Tasks_Completed";
import WELCOME_TASK_HEADER_TASKS_OPEN from "@salesforce/label/c.Welcome_Task_Header_Tasks_Open";
import WELCOME_TASK_OPEN_TASKS from "@salesforce/label/c.Welcome_Task_Open_Tasks";
import WELCOME_TASK_SUBHEADER_TASKS_COMPLETED from "@salesforce/label/c.Welcome_Task_Subheader_Tasks_Completed";

const TASK_SERVICE_SUCCESS_DATA = require("../../taskService/__tests__/data/taskServiceSuccessData.json");

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

jest.mock(
    "@salesforce/label/c.Welcome_Task_Header_Tasks_Completed",
    () => {
        return { default: "Onboarding Tasks" };
    },
    { virtual: true }
);

jest.mock(
    "@salesforce/label/c.Welcome_Task_Header_Tasks_Open",
    () => {
        return { default: "Let's get you up and running" };
    },
    { virtual: true }
);

jest.mock(
    "@salesforce/label/c.Welcome_Task_Open_Tasks",
    () => {
        return { default: "Open Tasks" };
    },
    { virtual: true }
);

jest.mock(
    "@salesforce/label/c.Welcome_Task_Subheader_Tasks_Completed",
    () => {
        return { default: "You're all caught up!" };
    },
    { virtual: true }
);

describe("c-welcome-task", () => {
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

    it("does not render wrapper element if tasks data is empty", () => {
        hasOnboardingAccess.mockResolvedValue(true);

        const element = createElement("c-welcome-task", {
            is: WelcomeTask
        });
        document.body.appendChild(element);

        return flushPromises().then(() => {
            const wrapperElement = element.shadowRoot.querySelector(
                "article.welcome-task-card"
            );
            expect(wrapperElement).toBeNull();
        });
    });

    it("renders wrapper element if tasks data exists", () => {
        getTasks.mockResolvedValue(TASK_SERVICE_SUCCESS_DATA.APEX_GET_TASKS);
        hasOnboardingAccess.mockResolvedValue(true);

        const element = createElement("c-welcome-task", {
            is: WelcomeTask
        });
        document.body.appendChild(element);

        return flushPromises().then(() => {
            const wrapperElement = element.shadowRoot.querySelector(
                "article.welcome-task-card"
            );
            expect(wrapperElement).not.toBeNull();
        });
    });

    it("sets proper header and subheader content if some tasks are not completed", () => {
        getTasks.mockResolvedValue(TASK_SERVICE_SUCCESS_DATA.APEX_GET_TASKS);
        hasOnboardingAccess.mockResolvedValue(true);

        const element = createElement("c-welcome-task", {
            is: WelcomeTask
        });
        document.body.appendChild(element);

        return flushPromises().then(() => {
            const headerElement = element.shadowRoot.querySelector(
                "h2.welcome-task-header"
            );
            expect(headerElement.textContent).toBe(
                WELCOME_TASK_HEADER_TASKS_OPEN
            );

            const openTasksLabelElement = element.shadowRoot.querySelector(
                "div.open-tasks-description"
            );

            expect(openTasksLabelElement.textContent).toBe(
                WELCOME_TASK_OPEN_TASKS
            );
        });
    });

    it("sets proper header and subheader content if tasks are completed", () => {
        getTasks.mockResolvedValue(
            TASK_SERVICE_SUCCESS_DATA.APEX_GET_TASKS.map((task) => {
                task.completed = true;
                return task;
            })
        );
        hasOnboardingAccess.mockResolvedValue(true);

        const element = createElement("c-welcome-task", {
            is: WelcomeTask
        });
        document.body.appendChild(element);

        return flushPromises().then(() => {
            const headerElement = element.shadowRoot.querySelector(
                "h2.welcome-task-header"
            );
            expect(headerElement.textContent).toBe(
                WELCOME_TASK_HEADER_TASKS_COMPLETED
            );

            const subheaderElement = element.shadowRoot.querySelector(
                "h3.welcome-task-subheader"
            );
            expect(subheaderElement.textContent).toBe(
                WELCOME_TASK_SUBHEADER_TASKS_COMPLETED
            );
        });
    });

    it("does not render the outermost container element if the license is not available", () => {
        hasOnboardingAccess.mockResolvedValue(false);

        const element = createElement("c-welcome-task", {
            is: WelcomeTask
        });
        document.body.appendChild(element);

        return flushPromises().then(() => {
            const wrapperElement = element.shadowRoot.querySelector(
                "article.welcome-task-card"
            );
            expect(wrapperElement).toBeNull();
        });
    });
});
