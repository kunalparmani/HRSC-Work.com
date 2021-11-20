@IsTest
public with sharing class CheckObjectPermissionTest {
    public static final String TEST_EMAIL_USER_WITH_ACCESS = 'employee.access@unittest.com';
    public static final String TEST_EMAIL_USER_WITHOUT_ACCESS = 'employee.no.access@unittest.com';

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

            insert TestDataFactory_Hrsc.createExternalUser(
                null,
                TEST_EMAIL_USER_WITHOUT_ACCESS,
                'Standard Platform User'
            );
        }
    }

    @IsTest
    static void shouldNotIndicateThatUserDoesNotHaveAccessToOnboardingObjects() {
        List<CheckObjectPermission.RequestOutput> requestOutputs;

        Test.startTest();

        requestOutputs = CheckObjectPermission.checkObjectsPerm();

        Test.stopTest();

        System.assertNotEquals(
            null,
            requestOutputs.size(),
            'Request outputs list should not be empty'
        );
        System.assertEquals(
            1,
            requestOutputs.size(),
            'Request outputs list size should match'
        );
        System.assertEquals(
            CheckObjectPermission.YES_ACCESS_INDICATOR,
            requestOutputs[0].hasReadOnboardingTemplate,
            'OnboardingTemplate access indicator parameter should be null'
        );
        System.assertEquals(
            CheckObjectPermission.YES_ACCESS_INDICATOR,
            requestOutputs[0].hasReadOnboardingTemplateTask,
            'OnboardingTemplateTask access indicator parameter should be null'
        );
        System.assertEquals(
            CheckObjectPermission.YES_ACCESS_INDICATOR,
            requestOutputs[0].hasReadOnboardingTask,
            'OnboardingTask access indicator parameter should be null'
        );
    }

    @IsTest
    static void shouldIndicateThatUserDoesNotHaveAccessToOnboardingObjects() {
        User userWithoutAccess = getTestUser(TEST_EMAIL_USER_WITHOUT_ACCESS);
        List<CheckObjectPermission.RequestOutput> requestOutputs;

        System.runAs(userWithoutAccess) {
            Test.startTest();

            requestOutputs = CheckObjectPermission.checkObjectsPerm();

            Test.stopTest();
        }

        System.assertNotEquals(
            null,
            requestOutputs.size(),
            'Request outputs list should not be empty'
        );
        System.assertEquals(
            1,
            requestOutputs.size(),
            'Request outputs list size should match'
        );
        System.assertEquals(
            CheckObjectPermission.NO_ACCESS_INDICATOR,
            requestOutputs[0].hasReadOnboardingTemplate,
            'OnboardingTemplate access indicator parameter should match'
        );
        System.assertEquals(
            CheckObjectPermission.NO_ACCESS_INDICATOR,
            requestOutputs[0].hasReadOnboardingTemplateTask,
            'OnboardingTemplateTask access indicator parameter should should match'
        );
        System.assertEquals(
            CheckObjectPermission.NO_ACCESS_INDICATOR,
            requestOutputs[0].hasReadOnboardingTask,
            'OnboardingTask access indicator parameter should should match'
        );
        System.assertNotEquals(
            null,
            requestOutputs[0].errorMessage,
            'Error message should not be empty'
        );
    }

    private static User getTestUser(String email) {
        return [
            SELECT Id, FirstName, LastName, Email, ContactId, FullPhotoUrl
            FROM User
            WHERE Email = :email
            LIMIT 1
        ];
    }
}
