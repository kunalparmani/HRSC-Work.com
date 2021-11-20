import getTasks from "@salesforce/apex/OnboardingChecklist.getTasks";
import hasOnboardingAccess from "@salesforce/apex/OnboardingFeatureAccess.hasOnboardingAccess";
import ErrorHandlingService from "c/errorHandlingService";
import TaskService from "c/taskService";
const TASK_SERVICE_SUCCESS_DATA = require("./data/taskServiceSuccessData.json");
const TASK_SERVICE_ERROR_DATA = require("./data/taskServiceErrorData.json");

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

jest.mock("c/errorHandlingService");
ErrorHandlingService.mockImplementation(() => {
    return {
        handleError: jest.fn()
    };
});

let taskService;

describe("c-task-service", () => {
    beforeAll(() => {
        taskService = new TaskService();
        taskService._errorHandlingService = new ErrorHandlingService();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("returns two tasks data returned from imperative getTasks Apex call", async () => {
        getTasks.mockResolvedValue(TASK_SERVICE_SUCCESS_DATA.APEX_GET_TASKS);

        const result = await taskService.getTasks("0031700000pJRRSAA4");

        expect(result.length).not.toBe(0);
        expect(result[0].taskId).not.toBe("");
        expect(result[0].label).toBe("NDA");
        expect(result[0].description).toBe("Example description for NDA task.");
        expect(result[0].flowAPIName).toBe("NDA");
        expect(result[0].status).toBe("New");
        expect(result[0].completed).toBe(false);
        expect(result[0].flowUrl).toBe("/flow/NDA");

        expect(result[1].taskId).not.toBe("");
        expect(result[1].label).toBe("Setup ESPP");
        expect(result[1].description).toBe(
            "Example description for Setup ESPP task."
        );
        expect(result[1].flowAPIName).toBe("Benefits_ESPP_Day_1");
        expect(result[1].status).toBe("New");
        expect(result[1].completed).toBe(false);
        expect(result[1].flowUrl).toBe("/flow/Benefits_ESPP_Day_1");
    });

    it("returns an empty array if falsy value is returned from imperative getTasks Apex call", async () => {
        getTasks.mockResolvedValue(null);

        const result = await taskService.getTasks("0031700000pJRRSAA4");

        expect(result.length).toBe(0);
    });

    it("invokes a handleError method responsible for handling errors from imperative getTasks Apex call", async () => {
        getTasks.mockRejectedValue(TASK_SERVICE_ERROR_DATA);

        await taskService.getTasks(this, "");
        expect(taskService._errorHandlingService.handleError).toBeCalledTimes(
            1
        );
        expect(taskService._errorHandlingService.handleError).toBeCalledWith(
            this,
            TASK_SERVICE_ERROR_DATA.body.message
        );
    });

    it("returns a boolean value returned from imperative hasOnboardingAccess Apex call", async () => {
        hasOnboardingAccess.mockResolvedValue(true);

        const result = await taskService.hasOnboardingAccess();

        expect(result).toBe(true);
    });

    it("invokes a handleError method responsible for handling errors from imperative hasOnboardingAccess Apex call", async () => {
        hasOnboardingAccess.mockRejectedValue(TASK_SERVICE_ERROR_DATA);

        await taskService.hasOnboardingAccess(this);
        expect(taskService._errorHandlingService.handleError).toBeCalledTimes(
            1
        );
        expect(taskService._errorHandlingService.handleError).toBeCalledWith(
            this,
            TASK_SERVICE_ERROR_DATA.body.message
        );
    });
});
