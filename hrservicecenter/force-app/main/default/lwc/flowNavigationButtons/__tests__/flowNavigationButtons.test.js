import { createElement } from "lwc";
import FlowNavigationButtons from "c/flowNavigationButtons";
import {
    FlowNavigationBackEventName,
    FlowNavigationFinishEventName,
    FlowNavigationNextEventName,
    FlowNavigationPauseEventName
} from "lightning/flowSupport";

import FORM_BUTTON_MARK_TASK_AS_COMPLETE from "@salesforce/label/c.Form_Button_Mark_Task_As_Completed";
import FORM_BUTTON_NEXT from "@salesforce/label/c.Form_Button_Next";
import FORM_BUTTON_PREVIOUS from "@salesforce/label/c.Form_Button_Previous";

jest.mock(
    "@salesforce/label/c.Form_Button_Mark_Task_As_Completed",
    () => {
        return { default: "Mark task as complete" };
    },
    { virtual: true }
);

jest.mock(
    "@salesforce/label/c.Form_Button_Next",
    () => {
        return { default: "Next" };
    },
    { virtual: true }
);

jest.mock(
    "@salesforce/label/c.Form_Button_Previous",
    () => {
        return { default: "Previous" };
    },
    { virtual: true }
);

const FLOW_CONTEXT = {
    TASK: "task"
};

const buttons = {
    FINISH: {
        apiName: "labelFinish",
        label: "Finish",
        selector: ".button-finish"
    },
    MARK_TASK_AS_COMPLETE: {
        apiName: "labelMarkTaskAsComplete",
        label: FORM_BUTTON_MARK_TASK_AS_COMPLETE,
        selector: ".button-mark-task-as-complete"
    },
    NEXT: {
        apiName: "labelNext",
        label: FORM_BUTTON_NEXT,
        selector: ".button-next"
    },
    PAUSE: {
        apiName: "labelPause",
        label: "Pause",
        selector: ".button-pause"
    },
    PREVIOUS: {
        apiName: "labelPrevious",
        label: FORM_BUTTON_PREVIOUS,
        selector: ".button-previous"
    }
};

const oldWindowLocation = window.location;

describe("c-flow-navigation-buttons", () => {
    beforeAll(() => {
        delete window.location;

        global.window = Object.create(window);
        Object.defineProperty(window, "location", {
            value: {
                ...Object.defineProperties(
                    {},
                    {
                        ...Object.getOwnPropertyDescriptors(oldWindowLocation),
                        assign: {
                            configurable: true,
                            value: jest.fn()
                        }
                    }
                )
            },
            writable: true
        });
    });

    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        jest.clearAllMocks();
    });

    afterAll(() => {
        window.location.search = "";
    });

    it("renders functioning 'Pause' and 'Previous' navigation buttons if labels are set", () => {
        const element = createElement("c-flow-navigation-buttons", {
            is: FlowNavigationButtons
        });
        element.labelPause = buttons.PAUSE.label;
        element[buttons.PREVIOUS.apiName] = buttons.PREVIOUS.label;
        document.body.appendChild(element);

        const pauseEventHandler = jest.fn();
        element.addEventListener(
            FlowNavigationPauseEventName,
            pauseEventHandler
        );

        const backEventHandler = jest.fn();
        element.addEventListener(FlowNavigationBackEventName, backEventHandler);

        return Promise.resolve().then(() => {
            const buttonPauseElement = element.shadowRoot.querySelector(
                buttons.PAUSE.selector
            );
            expect(buttonPauseElement).not.toBeNull();
            expect(buttonPauseElement.textContent).toBe(buttons.PAUSE.label);
            buttonPauseElement.dispatchEvent(new CustomEvent("click"));
            expect(pauseEventHandler).toHaveBeenCalledTimes(1);

            const buttonPreviousElement = element.shadowRoot.querySelector(
                buttons.PREVIOUS.selector
            );
            expect(buttonPreviousElement).not.toBeNull();
            expect(buttonPreviousElement.textContent).toBe(
                buttons.PREVIOUS.label
            );
            buttonPreviousElement.dispatchEvent(new CustomEvent("click"));
            expect(backEventHandler).toHaveBeenCalledTimes(1);
        });
    });

    it("renders functioning 'Next' and 'Finish' navigation buttons if labels are set and 'Mark task as complete' button label is not set", () => {
        const element = createElement("c-flow-navigation-buttons", {
            is: FlowNavigationButtons
        });
        element[buttons.NEXT.apiName] = buttons.NEXT.label;
        element[buttons.FINISH.apiName] = buttons.FINISH.label;
        document.body.appendChild(element);

        const nextEventHandler = jest.fn();
        element.addEventListener(FlowNavigationNextEventName, nextEventHandler);

        const finishEventHandler = jest.fn();
        element.addEventListener(
            FlowNavigationFinishEventName,
            finishEventHandler
        );

        return Promise.resolve().then(() => {
            const buttonNextElement = element.shadowRoot.querySelector(
                buttons.NEXT.selector
            );
            expect(buttonNextElement).not.toBeNull();
            expect(buttonNextElement.textContent).toBe(buttons.NEXT.label);
            buttonNextElement.dispatchEvent(new CustomEvent("click"));
            expect(nextEventHandler).toHaveBeenCalledTimes(1);

            const buttonFinishElement = element.shadowRoot.querySelector(
                buttons.FINISH.selector
            );
            expect(buttonFinishElement).not.toBeNull();
            expect(buttonFinishElement.textContent).toBe(buttons.FINISH.label);
            buttonFinishElement.dispatchEvent(new CustomEvent("click"));
            expect(finishEventHandler).toHaveBeenCalledTimes(1);
        });
    });

    it("renders functioning 'Mark task as complete' if label is set, 'Next' button label is not set and context is set in URL search params", () => {
        const params = new URLSearchParams(window.location.search);
        params.set("context", FLOW_CONTEXT.TASK);
        window.location.search = params.toString();

        const element = createElement("c-flow-navigation-buttons", {
            is: FlowNavigationButtons
        });
        element[buttons.MARK_TASK_AS_COMPLETE.apiName] =
            buttons.MARK_TASK_AS_COMPLETE.label;
        document.body.appendChild(element);

        const nextEventHandler = jest.fn();
        element.addEventListener(FlowNavigationNextEventName, nextEventHandler);

        return Promise.resolve().then(() => {
            const buttonMarkTaskAsCompleteElement = element.shadowRoot.querySelector(
                buttons.MARK_TASK_AS_COMPLETE.selector
            );
            expect(buttonMarkTaskAsCompleteElement).not.toBeNull();
            expect(buttonMarkTaskAsCompleteElement.textContent).toBe(
                buttons.MARK_TASK_AS_COMPLETE.label
            );
            buttonMarkTaskAsCompleteElement.dispatchEvent(
                new CustomEvent("click")
            );
            expect(nextEventHandler).toHaveBeenCalledTimes(1);
        });
    });

    it("does not render any navigation buttons if labels are not set", () => {
        const element = createElement("c-flow-navigation-buttons", {
            is: FlowNavigationButtons
        });
        document.body.appendChild(element);

        return Promise.resolve().then(() => {
            Object.keys(buttons).forEach((button) => {
                const buttonElement = element.shadowRoot.querySelector(
                    buttons[button].selector
                );
                expect(buttonElement).toBeNull();
            });
        });
    });
});
