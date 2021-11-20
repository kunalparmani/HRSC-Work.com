/**
 * @author  rkolasinski
 * @date    3/30/21
 * @description Controller class for Employee object-related methods.
 * @log
 * -----------------------------------------------------------------------------
 * Date        Developer            Description
 * -----------------------------------------------------------------------------
 * 3/30/21     rkolasinski          US-1 - created.
 * 5/27/21     rkolasinski          W-000232 - updated visibility of
 *                                  getEmployee* methods.
 */

public with sharing class EmployeeCtrl {
    /**
     * Maps Employee record properties to EmployeeWrapper wrapper.
     * @param employeeRecord an Employee record.
     * @return an EmployeeWrapper representing employee record data.
     */
    @TestVisible
    private static EmployeeWrapper buildEmployeeResponse(
        Employee employeeRecord
    ) {
        EmployeeWrapper employeeWrapper = new EmployeeWrapper();

        employeeWrapper.firstName = employeeRecord.FirstName;
        employeeWrapper.lastName = employeeRecord.LastName;
        employeeWrapper.email = employeeRecord.Email;
        employeeWrapper.employeeId = employeeRecord.Id;

        return employeeWrapper;
    }

    /**
     * Queries an employee record data based on the provided user id.
     * @param userId id of the User record.
     * @return an EmployeeWrapper representing employee record data.
     */
    @AuraEnabled(Cacheable=true)
    public static EmployeeWrapper getEmployee(Id userId) {
        EmployeeWrapper employeeWrapper = new EmployeeWrapper();
        List<Employee> employee = getEmployeeRecordByUserId(userId);
        if (employee.size() > 0) {
            employeeWrapper = buildEmployeeResponse(employee[0]);
        }
        return employeeWrapper;
    }

    /**
     * Queries an employee record based on the provided user id.
     * @param userId id of the User record.
     * @return an Employee record representing employee data.
     */
    public static List<Employee> getEmployeeRecordByUserId(Id userId) {
        return [
            SELECT
                Id,
                FirstName,
                LastName,
                Email,
                OwnerId,
                ManagerId,
                UserId,
                StatusAsOf
            FROM Employee
            WHERE UserId = :userId
        ];
    }

    /**
     * Queries the User record data based on the provided user id.
     * @param userId id of the User record.
     * @return User record representing user data.
     */
    @TestVisible
    private static User getUserRecord(Id userId) {
        return [
            SELECT FirstName, LastName, FullPhotoUrl, Email
            FROM User
            WHERE Id = :userId
        ];
    }

    /**
     * Wrapper for the Employee object properties.
     */
    public class EmployeeWrapper {
        @AuraEnabled
        public String firstName { get; set; }
        @AuraEnabled
        public String email { get; set; }
        @AuraEnabled
        public Id employeeId { get; set; }
        @AuraEnabled
        public String lastName { get; set; }
    }
}
