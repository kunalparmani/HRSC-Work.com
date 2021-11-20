/**
 * @author  rkolasinski
 * @date    4/16/21
 * @description Test class for EmployeeCtrl.
 * @log
 * -----------------------------------------------------------------------------
 * Date        Developer            Description
 * -----------------------------------------------------------------------------
 * 4/16/21     rkolasinski          US-1 - created.
 */

@IsTest
private class EmployeeCtrlTest {
    public static final String TEST_HIRING_MANAGER_EMAIL = 'testHiringManager@unittest.com';
    public static final String TEST_EMAIL_EMPLOYEE = 'employee@unittest.com';

    @TestSetup
    static void setup() {
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
                TEST_HIRING_MANAGER_EMAIL,
                '9999999991'
            );
            testContact.AccountId = testAdmin.Id;
            insert testContact;

            User testHiringManager = TestDataFactory_Hrsc.createExternalUser(
                testContact.Id,
                TEST_HIRING_MANAGER_EMAIL,
                'Standard Platform User'
            );
            insert testHiringManager;

            Employee manager = TestDataFactory_Hrsc.createTestEmployee(
                'Test',
                'Manager',
                TEST_HIRING_MANAGER_EMAIL,
                '0001',
                'Active',
                Datetime.newInstance(2021, 4, 10),
                'Employee',
                testHiringManager.Id,
                null,
                testHiringManager.Id
            );

            PermissionSet permissionSet = [
                SELECT Id
                FROM PermissionSet
                WHERE Name = 'workplace_user'
            ];
            insert new PermissionSetAssignment(
                AssigneeId = testHiringManager.Id,
                PermissionSetId = permissionSet.Id
            );

            Contact employeeContact = TestDataFactory_Hrsc.createTestContact(
                'Test',
                'Employee',
                TEST_EMAIL_EMPLOYEE,
                '9999999992'
            );
            employeeContact.AccountId = testAdmin.Id;
            insert employeeContact;

            User employeeUser = TestDataFactory_Hrsc.createExternalUser(
                employeeContact.Id,
                employeeContact.Email,
                'Standard Platform User'
            );
            insert employeeUser;

            TestDataFactory_Hrsc.createTestEmployee(
                'Test',
                'Employee',
                TEST_EMAIL_EMPLOYEE,
                '0002',
                'Active',
                Datetime.newInstance(2021, 4, 10),
                'Employee',
                employeeUser.Id,
                manager.Id,
                employeeUser.Id
            );

            insert new PermissionSetAssignment(
                AssigneeId = employeeUser.Id,
                PermissionSetId = permissionSet.Id
            );
        }
    }

    @IsTest
    static void testBuildEmployeeResponse() {
        User testEmployeeUser = getTestUser(TEST_EMAIL_EMPLOYEE);
        Employee employee = getEmployeeRecord(testEmployeeUser.Id);

        Test.startTest();

        EmployeeCtrl.EmployeeWrapper employeeWrapper = EmployeeCtrl.buildEmployeeResponse(
            employee
        );

        Test.stopTest();

        System.assertNotEquals(
            null,
            employeeWrapper,
            'Employee response wrapper should not be empty'
        );
        System.assertEquals(
            employee.FirstName,
            employeeWrapper.firstName,
            'First name values should match'
        );
        System.assertEquals(
            employee.LastName,
            employeeWrapper.lastName,
            'Last name values should match'
        );
        System.assertEquals(
            employee.Email,
            employeeWrapper.email,
            'Email values should match'
        );
        System.assertEquals(
            employee.Id,
            employeeWrapper.employeeId,
            'Id values should match'
        );
    }

    @IsTest
    static void testGetEmployee() {
        User testEmployeeUser = getTestUser(TEST_EMAIL_EMPLOYEE);
        Employee employee = getEmployeeRecord(testEmployeeUser.Id);
        EmployeeCtrl.EmployeeWrapper employeeWrapper;

        System.runAs(testEmployeeUser) {
            Test.startTest();

            employeeWrapper = EmployeeCtrl.getEmployee(testEmployeeUser.Id);

            Test.stopTest();
        }

        System.assertNotEquals(
            null,
            employeeWrapper,
            'Employee response wrapper should not be empty'
        );
        System.assertEquals(
            employee.FirstName,
            employeeWrapper.firstName,
            'First name values should match'
        );
        System.assertEquals(
            employee.LastName,
            employeeWrapper.lastName,
            'Last name values should match'
        );
        System.assertEquals(
            employee.Email,
            employeeWrapper.email,
            'Email values should match'
        );
        System.assertEquals(
            employee.Id,
            employeeWrapper.employeeId,
            'Id values should match'
        );
    }

    @IsTest
    static void testGetEmployeeRecordByUserId() {
        User testEmployeeUser = getTestUser(TEST_EMAIL_EMPLOYEE);
        Employee employee = getEmployeeRecord(testEmployeeUser.Id);
        Employee employeeRecord;

        System.runAs(testEmployeeUser) {
            Test.startTest();

            employeeRecord = EmployeeCtrl.getEmployeeRecordByUserId(
                testEmployeeUser.Id
            )[0];

            Test.stopTest();
        }

        System.assertNotEquals(
            null,
            employeeRecord,
            'Employee response wrapper should not be empty'
        );
        System.assertEquals(
            employee.FirstName,
            employeeRecord.FirstName,
            'First name values should match'
        );
        System.assertEquals(
            employee.LastName,
            employeeRecord.LastName,
            'Last name values should match'
        );
        System.assertEquals(
            employee.Email,
            employeeRecord.Email,
            'Email values should match'
        );
        System.assertEquals(
            employee.Id,
            employeeRecord.Id,
            'Id values should match'
        );
        System.assertEquals(
            employee.StatusAsOf,
            employeeRecord.StatusAsOf,
            'StatusAsOf values should match'
        );
    }

    @IsTest
    static void testGetUserRecord() {
        User testEmployeeUser = getTestUser(TEST_EMAIL_EMPLOYEE);
        User userRecord;

        System.runAs(testEmployeeUser) {
            Test.startTest();

            userRecord = EmployeeCtrl.getUserRecord(testEmployeeUser.Id);

            Test.stopTest();
        }

        System.assertNotEquals(
            null,
            userRecord,
            'User record should not be empty'
        );
        System.assertEquals(
            testEmployeeUser.FirstName,
            userRecord.FirstName,
            'First name values should match'
        );
        System.assertEquals(
            testEmployeeUser.LastName,
            userRecord.LastName,
            'Last name values should match'
        );
        System.assertEquals(
            testEmployeeUser.Email,
            userRecord.Email,
            'Last name values should match'
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

    private static Employee getEmployeeRecord(Id userId) {
        return [
            SELECT
                Id,
                FirstName,
                LastName,
                Email,
                OwnerId,
                UserId,
                ManagerId,
                StatusAsOf
            FROM Employee
            WHERE UserId = :userId
        ];
    }
}
