import getEmployee from "@salesforce/apex/EmployeeCtrl.getEmployee";
import ErrorHandlingService from "c/errorHandlingService";
import EmployeeService from "c/employeeService";
const EMPLOYEE_SERVICE_SUCCESS_DATA = require("./data/employeeServiceSuccessData.json");
const EMPLOYEE_SERVICE_ERROR_DATA = require("./data/employeeServiceErrorData.json");

jest.mock(
    "@salesforce/apex/EmployeeCtrl.getEmployee",
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

let employeeService;

describe("c-employee-service", () => {
    beforeAll(() => {
        employeeService = new EmployeeService();
        employeeService._errorHandlingService = new ErrorHandlingService();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("returns employee returned from imperative Apex call", async () => {
        getEmployee.mockResolvedValue(
            EMPLOYEE_SERVICE_SUCCESS_DATA.APEX_GET_EMPLOYEE
        );

        const result = await employeeService.getEmployee("0031700000pJRRSAA4");
        expect(result.employeeId).not.toBe("");
        expect(result.firstName).toBe("John");
        expect(result.lastName).toBe("Doe");
        expect(result.email).toBe("john.doe@example.com");
    });

    it("invokes a handleError method responsible for handling errors from imperative getEmployee Apex call", async () => {
        getEmployee.mockRejectedValue(EMPLOYEE_SERVICE_ERROR_DATA);

        await employeeService.getEmployee(this, "");
        expect(
            employeeService._errorHandlingService.handleError
        ).toBeCalledTimes(1);
        expect(
            employeeService._errorHandlingService.handleError
        ).toBeCalledWith(this, EMPLOYEE_SERVICE_ERROR_DATA.body.message);
    });
});
