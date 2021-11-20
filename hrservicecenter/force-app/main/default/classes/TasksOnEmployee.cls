/**
 * @author  AbhayArora
 * @date    8/06/21
 * @description Controller class for Tasks Display inside Employees.
 * @log
 * -----------------------------------------------------------------------------
 * Date        Developer           Description
 * -----------------------------------------------------------------------------
 * 8/06/21     AbhayArora          US-246 - created.
 */

public with sharing class TasksOnEmployee {
    public static final String TASK_ONBOARDING_TASK_RECORD_TYPE_DEVELOPER_NAME = 'OnboardingTask';

    /**
     * Queries all tasks related to a given employee.
     * @param employeeID Id of the employee record.
     * @return A List<Task> representing employee onboarding tasks.
     */
    @AuraEnabled(Cacheable=true)
    public static List<Task> searchTasksOnEmployees(String employeeID) {
        Id onboardingTaskRecordTypeId = Schema.SObjectType.Task.getRecordTypeInfosByDeveloperName()
            .get(TASK_ONBOARDING_TASK_RECORD_TYPE_DEVELOPER_NAME)
            .getRecordTypeId();
        Employee record = [
            SELECT Id, UserId
            FROM Employee
            WHERE Id = :employeeID
        ];

        return [
            SELECT
                Id,
                Subject,
                Description,
                Owner.Name,
                Owner.Id,
                Status,
                ActivityDate
            FROM Task
            WHERE
                RecordTypeId = :onboardingTaskRecordTypeId
                AND OwnerId = :record.UserId
            ORDER BY ActivityDate ASC
        ];
    }
}
