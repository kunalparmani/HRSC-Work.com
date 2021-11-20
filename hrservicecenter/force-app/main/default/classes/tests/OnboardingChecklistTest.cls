/**
 * @author  Kunal Parmani
 * @date    5/17/21
 * @description Test class for OnboardingChecklist.
 * @log
 * -----------------------------------------------------------------------------
 * Date        Developer            Description
 * -----------------------------------------------------------------------------
 * 4/16/21     kunal parmani
 * 5/27/21     rkolasinski          W-000103 - Updates related to new data model.
 */
@IsTest
public class OnboardingChecklistTest {
    public static final String TEST_EMAIL_EMPLOYEE = 'employee@unittest.com';

    /**
     * Prepares the data to test the OnboardingChecklist class.
     * Creates Account,Contact,Users,Employee,OnboardingTask__c and Task records.
     */
    @TestSetup
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

            List<OnboardingTask__c> onBoardOptionList = OnboardingChecklistUtilTest.createOnboardingTasks(
                flowNameList
            );

            OnboardingChecklistUtilTest.createTasks(
                onBoardOptionList,
                testEmployee.Id
            );
        }
    }

    /**
     * testGetTasks() method is the test method to test getTasks() method from OnboardingChecklist class.
     * This test will check if the Task is present for the respective employee.
     * If present, getTasks() method will return it in the form of List of TaskWrapper records with Task data.
     */
    @IsTest
    public static void testGetTasks() {
        User testEmployee = [
            SELECT Id
            FROM User
            WHERE Email = :TEST_EMAIL_EMPLOYEE
        ];

        Test.startTest();
        List<OnboardingChecklist.TaskWrapper> taskList = OnboardingChecklist.getTasks(
            testEmployee.Id
        );
        Test.stopTest();

        System.assertEquals(7, taskList.size());
    }

    /**
     * Check if the OnboardingTask__c.FlowAPIName__c is returned correctly for a given employee
     * based on the provided task id value.
     */
    @IsTest
    public static void testGetFlowAPINameApex() {
        User testEmployee = [
            SELECT Id
            FROM User
            WHERE Email = :TEST_EMAIL_EMPLOYEE
        ];
        List<Task> testTask = [
            SELECT Id
            FROM Task
            WHERE OwnerId = :testEmployee.Id
        ];
        String flowApiName;

        Test.startTest();

        flowApiName = OnboardingChecklist.getFlowAPINameApex(testTask[0].Id);

        Test.stopTest();

        System.assertNotEquals(
            null,
            flowApiName,
            'OnboardingTask__c.FlowAPIName__c value is not empty'
        );
    }

    /**
     * Checks if the checklist order is correct when all of the tasks
     * have dueDate field values set.
     */
    @IsTest
    public static void shouldSortTaskWrappersIfAllWrappersHaveDueDateSet() {
        List<OnboardingChecklist.TaskWrapper> taskWrappers = new List<OnboardingChecklist.TaskWrapper>();
        OnboardingChecklist.TaskWrapper welcomeVideoTaskWrapper = new OnboardingChecklist.TaskWrapper();
        welcomeVideoTaskWrapper.dueDate = Date.valueOf('2021-06-21 00:00:00');
        welcomeVideoTaskWrapper.label = '[Sample] Welcome Video';
        taskWrappers.add(welcomeVideoTaskWrapper);

        OnboardingChecklist.TaskWrapper reviewDocumentsTaskWrapper = new OnboardingChecklist.TaskWrapper();
        reviewDocumentsTaskWrapper.dueDate = Date.valueOf(
            '2021-06-24 00:00:00'
        );
        reviewDocumentsTaskWrapper.label = 'Review Documents';
        taskWrappers.add(reviewDocumentsTaskWrapper);

        OnboardingChecklist.TaskWrapper corporateCreditCardTaskWrapper = new OnboardingChecklist.TaskWrapper();
        corporateCreditCardTaskWrapper.dueDate = Date.valueOf(
            '2021-06-22 00:00:00'
        );
        corporateCreditCardTaskWrapper.label = '[Sample] Apply for Corporate Credit Card';
        taskWrappers.add(corporateCreditCardTaskWrapper);

        OnboardingChecklist.TaskWrapper ergonomicAssessmentTaskWrapper = new OnboardingChecklist.TaskWrapper();
        ergonomicAssessmentTaskWrapper.dueDate = Date.valueOf(
            '2021-06-26 00:00:00'
        );
        ergonomicAssessmentTaskWrapper.label = '[Sample] Ergonomic Assessment';
        taskWrappers.add(ergonomicAssessmentTaskWrapper);

        Test.startTest();

        taskWrappers.sort();

        Test.stopTest();

        System.assertEquals(
            '[Sample] Welcome Video',
            taskWrappers[0].label,
            'Welcome Video task wrapper should be first on the list'
        );
        System.assertEquals(
            '[Sample] Apply for Corporate Credit Card',
            taskWrappers[1].label,
            'Apply for Corporate Credit Card task wrapper should be second on the list'
        );
        System.assertEquals(
            'Review Documents',
            taskWrappers[2].label,
            'Review Documents task wrapper should be third on the list'
        );
        System.assertEquals(
            '[Sample] Ergonomic Assessment',
            taskWrappers[3].label,
            'Ergonomic Assessment task wrapper should be fourth on the list'
        );
    }

    /**
     * Checks if the checklist order is correct when some of the tasks
     * have the same due dates.
     */
    @IsTest
    public static void shouldSortTaskWrappersIfSomeWrappersHaveTheSameDueDate() {
        List<OnboardingChecklist.TaskWrapper> taskWrappers = new List<OnboardingChecklist.TaskWrapper>();
        OnboardingChecklist.TaskWrapper welcomeVideoTaskWrapper = new OnboardingChecklist.TaskWrapper();
        welcomeVideoTaskWrapper.dueDate = Date.valueOf('2021-06-24 00:00:00');
        welcomeVideoTaskWrapper.label = '[Sample] Welcome Video';
        taskWrappers.add(welcomeVideoTaskWrapper);

        OnboardingChecklist.TaskWrapper reviewDocumentsTaskWrapper = new OnboardingChecklist.TaskWrapper();
        reviewDocumentsTaskWrapper.dueDate = Date.valueOf(
            '2021-06-24 00:00:00'
        );
        reviewDocumentsTaskWrapper.label = 'Review Documents';
        taskWrappers.add(reviewDocumentsTaskWrapper);

        OnboardingChecklist.TaskWrapper corporateCreditCardTaskWrapper = new OnboardingChecklist.TaskWrapper();
        corporateCreditCardTaskWrapper.dueDate = Date.valueOf(
            '2021-06-22 00:00:00'
        );
        corporateCreditCardTaskWrapper.label = '[Sample] Apply for Corporate Credit Card';
        taskWrappers.add(corporateCreditCardTaskWrapper);

        OnboardingChecklist.TaskWrapper ergonomicAssessmentTaskWrapper = new OnboardingChecklist.TaskWrapper();
        ergonomicAssessmentTaskWrapper.dueDate = Date.valueOf(
            '2021-06-26 00:00:00'
        );
        ergonomicAssessmentTaskWrapper.label = '[Sample] Ergonomic Assessment';
        taskWrappers.add(ergonomicAssessmentTaskWrapper);

        Test.startTest();

        taskWrappers.sort();

        Test.stopTest();

        System.assertEquals(
            '[Sample] Apply for Corporate Credit Card',
            taskWrappers[0].label,
            'Apply for Corporate Credit Card task wrapper should be first on the list'
        );
        System.assertEquals(
            '[Sample] Welcome Video',
            taskWrappers[1].label,
            'Welcome Video task wrapper should be second on the list'
        );
        System.assertEquals(
            'Review Documents',
            taskWrappers[2].label,
            'Review Documents task wrapper should be third on the list'
        );
        System.assertEquals(
            '[Sample] Ergonomic Assessment',
            taskWrappers[3].label,
            'Ergonomic Assessment task wrapper should be fourth on the list'
        );
    }

    /**
     * Checks if the checklist order is correct when some of the tasks
     * have due date missing.
     */
    @IsTest
    public static void shouldSortTaskWrappersIfSomeWrappersHaveDueDateMissing() {
        List<OnboardingChecklist.TaskWrapper> taskWrappers = new List<OnboardingChecklist.TaskWrapper>();
        OnboardingChecklist.TaskWrapper welcomeVideoTaskWrapper = new OnboardingChecklist.TaskWrapper();
        welcomeVideoTaskWrapper.label = '[Sample] Welcome Video';
        taskWrappers.add(welcomeVideoTaskWrapper);

        OnboardingChecklist.TaskWrapper reviewDocumentsTaskWrapper = new OnboardingChecklist.TaskWrapper();
        reviewDocumentsTaskWrapper.label = 'Review Documents';
        taskWrappers.add(reviewDocumentsTaskWrapper);

        OnboardingChecklist.TaskWrapper corporateCreditCardTaskWrapper = new OnboardingChecklist.TaskWrapper();
        corporateCreditCardTaskWrapper.dueDate = Date.valueOf(
            '2021-06-22 00:00:00'
        );
        corporateCreditCardTaskWrapper.label = '[Sample] Apply for Corporate Credit Card';
        taskWrappers.add(corporateCreditCardTaskWrapper);

        OnboardingChecklist.TaskWrapper ergonomicAssessmentTaskWrapper = new OnboardingChecklist.TaskWrapper();
        ergonomicAssessmentTaskWrapper.dueDate = Date.valueOf(
            '2021-06-26 00:00:00'
        );
        ergonomicAssessmentTaskWrapper.label = '[Sample] Ergonomic Assessment';
        taskWrappers.add(ergonomicAssessmentTaskWrapper);

        Test.startTest();

        taskWrappers.sort();

        Test.stopTest();

        System.assertEquals(
            '[Sample] Apply for Corporate Credit Card',
            taskWrappers[0].label,
            'Apply for Corporate Credit Card task wrapper should be first on the list'
        );
        System.assertEquals(
            '[Sample] Ergonomic Assessment',
            taskWrappers[1].label,
            'Ergonomic Assessment task wrapper should be second on the list'
        );
        System.assertEquals(
            '[Sample] Welcome Video',
            taskWrappers[2].label,
            'Welcome Video task wrapper should be third on the list'
        );
        System.assertEquals(
            'Review Documents',
            taskWrappers[3].label,
            'Review Documents task wrapper should be fourth on the list'
        );
    }

    /**
     * Checks if the checklist order is correct when one of the tasks
     * have due date missing and the subsequent task has due date set.
     */
    @IsTest
    public static void shouldSortTaskWrappersIfOneWrapperHasDueDateMissingAndSubsequentTaskDoesnt() {
        List<OnboardingChecklist.TaskWrapper> taskWrappers = new List<OnboardingChecklist.TaskWrapper>();
        OnboardingChecklist.TaskWrapper welcomeVideoTaskWrapper = new OnboardingChecklist.TaskWrapper();
        welcomeVideoTaskWrapper.label = '[Sample] Welcome Video';
        welcomeVideoTaskWrapper.dueDate = Date.valueOf('2021-06-24 00:00:00');
        taskWrappers.add(welcomeVideoTaskWrapper);

        OnboardingChecklist.TaskWrapper reviewDocumentsTaskWrapper = new OnboardingChecklist.TaskWrapper();
        reviewDocumentsTaskWrapper.label = 'Review Documents';
        taskWrappers.add(reviewDocumentsTaskWrapper);

        OnboardingChecklist.TaskWrapper corporateCreditCardTaskWrapper = new OnboardingChecklist.TaskWrapper();
        corporateCreditCardTaskWrapper.dueDate = Date.valueOf(
            '2021-06-22 00:00:00'
        );
        corporateCreditCardTaskWrapper.label = '[Sample] Apply for Corporate Credit Card';
        taskWrappers.add(corporateCreditCardTaskWrapper);

        OnboardingChecklist.TaskWrapper ergonomicAssessmentTaskWrapper = new OnboardingChecklist.TaskWrapper();
        ergonomicAssessmentTaskWrapper.dueDate = Date.valueOf(
            '2021-06-26 00:00:00'
        );
        ergonomicAssessmentTaskWrapper.label = '[Sample] Ergonomic Assessment';
        taskWrappers.add(ergonomicAssessmentTaskWrapper);

        Test.startTest();

        taskWrappers.sort();

        Test.stopTest();

        System.assertEquals(
            '[Sample] Apply for Corporate Credit Card',
            taskWrappers[0].label,
            'Apply for Corporate Credit Card task wrapper should be first on the list'
        );
        System.assertEquals(
            '[Sample] Welcome Video',
            taskWrappers[1].label,
            'Welcome Video task wrapper should be second on the list'
        );
        System.assertEquals(
            '[Sample] Ergonomic Assessment',
            taskWrappers[2].label,
            'Ergonomic Assessment task wrapper should be third on the list'
        );
        System.assertEquals(
            'Review Documents',
            taskWrappers[3].label,
            'Review Documents task wrapper should be fourth on the list'
        );
    }
}
