import ErrorHandlingService from "c/errorHandlingService";
import WelcomeTask from "c/welcomeTask";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

jest.mock("c/welcomeTask");
WelcomeTask.mockImplementation(() => {
    return {
        default: jest.fn(),
        dispatchEvent: jest.fn()
    };
});

const consoleSpy = jest.spyOn(console, "log").mockImplementation();

describe("c-error-handling-service", () => {
    beforeEach(() => {
        consoleSpy.mockClear();
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("handles an error and dispatches the toast event with error details", async () => {
        const errorMessage = "An unexpected error has occurred.";
        const welcomeTask = new WelcomeTask();
        const errorHandlingService = new ErrorHandlingService();
        errorHandlingService.handleError(welcomeTask, errorMessage);

        expect(console.log).toBeCalledTimes(1);
        expect(console.log).toBeCalledWith(errorMessage);
        expect(welcomeTask.dispatchEvent).toBeCalledTimes(1);
        expect(welcomeTask.dispatchEvent).toBeCalledWith(
            new ShowToastEvent({
                title: "Error",
                message: errorMessage,
                variant: "error"
            })
        );
    });
});
