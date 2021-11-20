/**
 * @author  Kunal Parmani
 * @date    6/03/21
 * @description Test class for CreateOnboardingTasks.
 * @log
 * -----------------------------------------------------------------------------
 * Date        Developer
 * -----------------------------------------------------------------------------
 * 6/03/21     kunal parmani
 */
@isTest
public with sharing class CreateOnboardingTasksTest {
    public static final String TEST_EMAIL_EMPLOYEE = 'employee@unittest.com';
    public static final String TEST_EMAIL_EMPLOYEE_WITHOUT_USER = 'employeeNoUser@unittest.com';
    private static final String ONBOARDING_TASK_RECORD_TYPE_DEVELOPER_NAME = 'OnboardingTask';

    /**
     * Prepares the data to test the CreateOnboardingTasks class.
     * Creates Account,Contact,Users,Employee records.
     */
    @testSetup
    public static void testData() {
        User sysAdmin = TestDataFactory_Hrsc.createSysAdminUser(
            'sysadmin@unittest.com'
        );

        System.runAs(sysAdmin) {
            Account testAdmin = TestDataFactory_Hrsc.createTestAccount(
                'Test Name'
            );
            insert testAdmin;

            Contact testContact = TestDataFactory_Hrsc.createTestContact(
                'Test First',
                'Test Last',
                TEST_EMAIL_EMPLOYEE,
                '9999999991'
            );
            testContact.AccountId = testAdmin.Id;
            insert testContact;

            User testHiringManager = TestDataFactory_Hrsc.createExternalUser(
                null,
                TEST_EMAIL_EMPLOYEE,
                'Standard Platform User'
            );
            insert testHiringManager;

            Employee manager = TestDataFactory_Hrsc.createTestEmployee(
                'Test',
                'Manager',
                TEST_EMAIL_EMPLOYEE,
                '0001',
                'Active',
                Datetime.newInstance(2021, 4, 10),
                'Employee',
                testHiringManager.Id,
                null,
                testHiringManager.Id
            );

            Employee employeeWithoutUser = TestDataFactory_Hrsc.createTestEmployee(
                'Test',
                'NoUser',
                TEST_EMAIL_EMPLOYEE_WITHOUT_USER,
                '0002',
                'Active',
                Datetime.newInstance(2021, 4, 10),
                'Employee',
                null,
                null,
                UserInfo.getUserId()
            );

            OnboardingTemplate__c oBTemplate = TestDataFactory_Hrsc.createOnboardingTemplates(
                'Basic Onboarding'
            );
            insert oBTemplate;

            List<String> flowNameList = TestDataFactory_Hrsc.getFlowNames();
            List<OnboardingTask__c> oBTaskList = TestDataFactory_Hrsc.createOnboardingTask(
                flowNameList
            );
            insert oBTaskList;

            List<OnboardingTemplateTask__c> oBTemplateTaskList = TestDataFactory_Hrsc.createOnboardingTemplateTask(
                oBTemplate,
                oBTaskList
            );
            insert oBTemplateTaskList;
        }
    }

    /**
     * Test Method to test the createTasks() method
     */
    @isTest
    public static void testcreateTasksForEmployeeWithUser() {
        Employee testEmployee = [
            SELECT id, EmployeeNumber, UserId, Name, StatusAsOf
            FROM Employee
            WHERE Email = :TEST_EMAIL_EMPLOYEE
        ];
        Id onboardingTaskRecordTypeId = Schema.SObjectType.Task.getRecordTypeInfosByDeveloperName()
            .get(ONBOARDING_TASK_RECORD_TYPE_DEVELOPER_NAME)
            .getRecordTypeId();

        List<CreateOnboardingTasks.RequestInput> requestInputs = new List<CreateOnboardingTasks.RequestInput>();
        CreateOnboardingTasks.RequestInput req = new CreateOnboardingTasks.RequestInput();
        req.selectedTemplates = 'Basic Onboarding';
        req.UserID = testEmployee.UserId;
        requestInputs.add(req);

        Test.startTest();
        List<CreateOnboardingTasks.RequestOutput> requestOutputs = CreateOnboardingTasks.createTasks(
            requestInputs
        );
        Test.stopTest();

        System.assert(requestOutputs[0].isSuccess);
        System.assert(requestOutputs[0].total_Onboarding_Task > 0);

        List<Task> tasks = [
            SELECT Id, WhatId, OwnerId, Status, ActivityDate
            FROM Task
            WHERE
                OwnerId = :testEmployee.UserId
                AND RecordTypeId = :onboardingTaskRecordTypeId
        ];

        System.assertNotEquals(0, tasks.size(), 'Tasks list is not empty');

        Set<Id> onboardingTaskIds = new Set<Id>();
        for (Task t : tasks) {
            onboardingTaskIds.add(t.WhatId);
        }

        List<OnboardingTask__c> onboardingTasks = [
            SELECT Id, Name, Description__c, FlowAPIName__c, StartDayOffset__c
            FROM OnboardingTask__c
            WHERE Id IN :onboardingTaskIds
        ];

        for (Task t : tasks) {
            for (OnboardingTask__c onboardingTask : onboardingTasks) {
                if (t.WhatId == onboardingTask.Id) {
                    System.assertEquals(
                        testEmployee.StatusAsOf.date()
                            .addDays(
                                Integer.valueOf(
                                    onboardingTask.StartDayOffset__c
                                )
                            ),
                        t.ActivityDate,
                        'Activity date should match'
                    );
                }
            }
        }
    }

    /**
     * Test Method to test the createTasks() method
     */
    @isTest
    public static void testcreateTasksForEmployeeWithOutUser() {
        Employee testEmployee = [
            SELECT id, EmployeeNumber, UserId, Name
            FROM Employee
            WHERE Email = :TEST_EMAIL_EMPLOYEE_WITHOUT_USER
        ];

        List<CreateOnboardingTasks.RequestInput> requestInputs = new List<CreateOnboardingTasks.RequestInput>();
        CreateOnboardingTasks.RequestInput req = new CreateOnboardingTasks.RequestInput();
        req.selectedTemplates = 'Basic Onboarding';
        req.UserID = testEmployee.UserId;
        requestInputs.add(req);

        Test.startTest();
        List<CreateOnboardingTasks.RequestOutput> requestOutputs = CreateOnboardingTasks.createTasks(
            requestInputs
        );
        Test.stopTest();

        System.assert(!requestOutputs[0].isSuccess);
        System.assert(requestOutputs[0].total_Onboarding_Task == 0);
    }
}
