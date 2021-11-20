import { createElement } from "lwc";
import WelcomeHeroBanner from "c/welcomeHeroBanner";
import getEmployee from "@salesforce/apex/EmployeeCtrl.getEmployee";
import Welcome_Hero_Banner from "@salesforce/resourceUrl/Welcome_Hero_Banner";
import WELCOME_HERO_BANNER_HEADER from "@salesforce/label/c.Welcome_Hero_Banner_Header";

const EMPLOYEE_SERVICE_SUCCESS_DATA = require("../../employeeService/__tests__/data/employeeServiceSuccessData.json");

jest.mock(
    "@salesforce/apex/EmployeeCtrl.getEmployee",
    () => {
        return {
            default: jest.fn()
        };
    },
    { virtual: true }
);

jest.mock(
    "@salesforce/label/c.Welcome_Hero_Banner_Header",
    () => {
        return { default: "Welcome, {{firstName}}!" };
    },
    { virtual: true }
);

describe("c-welcome-hero-banner", () => {
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

    it("sets header content based on data returned from imperative Apex call", () => {
        getEmployee.mockResolvedValue(
            EMPLOYEE_SERVICE_SUCCESS_DATA.APEX_GET_EMPLOYEE
        );

        const element = createElement("c-welcome-hero-banner", {
            is: WelcomeHeroBanner
        });
        document.body.appendChild(element);

        return flushPromises().then(() => {
            const headerElement = element.shadowRoot.querySelector("h1");
            expect(headerElement).toBeDefined();
            expect(headerElement.textContent).toBe(
                WELCOME_HERO_BANNER_HEADER.replace(
                    "{{firstName}}",
                    EMPLOYEE_SERVICE_SUCCESS_DATA.APEX_GET_EMPLOYEE.firstName
                )
            );
        });
    });

    it("does not set employee first name in the header if there is no employee first name value set", () => {
        const employeeData = JSON.parse(
            JSON.stringify(EMPLOYEE_SERVICE_SUCCESS_DATA.APEX_GET_EMPLOYEE)
        );
        employeeData.firstName = "";
        getEmployee.mockResolvedValue(employeeData);

        const element = createElement("c-welcome-hero-banner", {
            is: WelcomeHeroBanner
        });
        document.body.appendChild(element);

        return flushPromises().then(() => {
            const headerElement = element.shadowRoot.querySelector("h1");
            expect(headerElement).toBeNull();
        });
    });

    it("does not render employee first name in the header if there is no employee data available", () => {
        getEmployee.mockResolvedValue(null);

        const element = createElement("c-welcome-hero-banner", {
            is: WelcomeHeroBanner
        });
        document.body.appendChild(element);

        return flushPromises().then(() => {
            const headerElement = element.shadowRoot.querySelector("h1");
            expect(headerElement).toBeNull();
        });
    });

    it("sets banner background image based on static resources content", () => {
        const element = createElement("c-welcome-hero-banner", {
            is: WelcomeHeroBanner
        });
        document.body.appendChild(element);

        return Promise.resolve().then(() => {
            const wrapperElement = element.shadowRoot.querySelector(
                "div.banner-wrapper"
            );
            expect(wrapperElement).toBeDefined();
            expect(wrapperElement.style.backgroundImage).toContain(
                Welcome_Hero_Banner
            );
            expect(wrapperElement.style.backgroundPosition).toBe("50%");
            expect(wrapperElement.style.backgroundRepeat).toBe("no-repeat");
            expect(wrapperElement.style.backgroundSize).toBe("cover");
        });
    });
});
