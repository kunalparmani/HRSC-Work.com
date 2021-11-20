/**
 * An apex controller Test that exposes the Tasks in Employees
 */

@IsTest
private class TasksOnEmployeeTest {
    public static final String TEST_EMAIL_EMPLOYEE = 'employee@unittest.com';

    @TestSetup
    static void initData() {
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

            User testEmployee = TestDataFactory_Hrsc.createExternalUser(
                testContact.Id,
                TEST_EMAIL_EMPLOYEE,
                'Standard Platform User'
            );
            insert testEmployee;

            TestDataFactory_Hrsc.createTestEmployee(
                'Test',
                'Employee',
                TEST_EMAIL_EMPLOYEE,
                '0001',
                'Active',
                Datetime.newInstance(2021, 4, 10),
                'Employee',
                testEmployee.Id,
                null,
                testEmployee.Id
            );

            List<String> flowNameList = OnboardingChecklistUtilTest.getFlowNames();

            List<OnboardingTask__c> onboardingOptionsList = OnboardingChecklistUtilTest.createOnboardingTasks(
                flowNameList
            );

            OnboardingChecklistUtilTest.createTasks(
                onboardingOptionsList,
                testEmployee.Id
            );
        }
    }

    @IsTest
    static void getOfferTableDataTest() {
        Employee employRec = [
            SELECT Id
            FROM Employee
            WHERE Email = :TEST_EMAIL_EMPLOYEE
        ];

        List<Task> tasksList;

        Test.startTest();

        tasksList = TasksOnEmployee.searchTasksOnEmployees(employRec.Id);

        Test.stopTest();

        System.assertNotEquals(
            0,
            tasksList.size(),
            'Tasks list should not be empty'
        );
    }
}
