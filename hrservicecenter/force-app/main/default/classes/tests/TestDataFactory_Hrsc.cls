/**
 * @author  rkolasinski
 * @date    4/16/21
 * @description Test data factory class.
 * @log
 * -----------------------------------------------------------------------------
 * Date        Developer            Description
 * -----------------------------------------------------------------------------
 * 4/16/21     rkolasinski          US-1 - created.
 */

@IsTest
public class TestDataFactory_Hrsc {
    public static User createSysAdminUser(String email) {
        Profile p = [
            SELECT Id, Name
            FROM Profile
            WHERE Name = 'System Administrator'
            LIMIT 1
        ];

        User u = new User(
            LastName = 'TestAdmin',
            Alias = 'utUser',
            Username = email + '.test',
            Email = email,
            ProfileId = p.Id,
            TimeZoneSidKey = 'America/New_York',
            LocaleSidKey = 'en_US',
            LanguageLocaleKey = 'en_US',
            EmailEncodingKey = 'ISO-8859-1',
            UserPermissionsKnowledgeUser = true
        );

        return u;
    }

    public static Account createTestAccount(String testName) {
        Account a = new Account(Name = testName);
        return a;
    }

    public static Contact createTestContact(
        String firstName,
        String lastName,
        String email,
        String phone
    ) {
        Contact c = new Contact(
            FirstName = firstName,
            LastName = lastName,
            Email = email,
            Phone = phone
        );
        return c;
    }

    public static User createExternalUser(
        Id contactId,
        String email,
        String profileName
    ) {
        User u = new User();
        u.LastName = 'External';
        u.Alias = 'utUser';
        u.LastName = 'User';
        u.Username = email + '.test';
        // u.ContactId = contactId;
        u.Email = email;
        Profile profile = [SELECT Id FROM Profile WHERE Name = :profileName];
        u.ProfileId = profile.Id;
        u.TimeZoneSidKey = 'America/New_York';
        u.LocaleSidKey = 'en_US';
        u.LanguageLocaleKey = 'en_US';
        u.EmailEncodingKey = 'ISO-8859-1';
        return u;
    }

    public static Employee createTestEmployee(
        String firstName,
        String lastName,
        String email,
        String employeeNumber,
        String employeeStatus,
        Datetime statusAsOf,
        String workerType,
        Id userId,
        Id managerId,
        Id ownerId
    ) {
        Employee e = new Employee(
            FirstName = firstName,
            LastName = lastName,
            Email = email,
            EmployeeNumber = employeeNumber,
            EmployeeStatus = employeeStatus,
            StatusAsOf = statusAsOf,
            WorkerType = workerType,
            UserId = userId,
            ManagerId = managerId,
            OwnerId = ownerId
        );
        insert e;
        return e;
    }

    public static List<String> getFlowNames() {
        List<String> flowNameList = new List<String>();
        flowNameList.add('Benefits 401K');
        flowNameList.add('Direct Deposit');
        flowNameList.add('Disability Disclosure');
        flowNameList.add('Sign Non-Disclosure Agreement');
        flowNameList.add('Verify Identity');
        flowNameList.add('I9 - Employment Eligibility Verification');
        flowNameList.add('Benefits Review');

        return flowNameList;
    }

    public static OnboardingTemplate__c createOnboardingTemplates(
        String templateName
    ) {
        OnboardingTemplate__c oBTemplate = new OnboardingTemplate__c();
        oBTemplate.Name = templateName;
        oBTemplate.Description__c = 'Some Onboarding Template Description here!!';
        oBTemplate.IsActive__c = true;

        return oBTemplate;
    }

    public static List<OnboardingTask__c> createOnboardingTask(
        List<String> taskNameList
    ) {
        List<OnboardingTask__c> oBTaskList = new List<OnboardingTask__c>();

        for (String tsk : taskNameList) {
            OnboardingTask__c oBTask = new OnboardingTask__c();
            oBTask.Description__c = 'Some Onboarding Task Description here!!';
            oBTask.FlowAPIName__c = tsk;
            oBTask.StartDayOffset__c = 7;
            oBTask.name = tsk;
            oBTaskList.add(oBTask);
        }

        return oBTaskList;
    }

    public static List<OnboardingTemplateTask__c> createOnboardingTemplateTask(
        OnboardingTemplate__c oBTemplate,
        List<OnboardingTask__c> oBTaskList
    ) {
        List<OnboardingTemplateTask__c> oBTemplateTaskList = new List<OnboardingTemplateTask__c>();

        for (OnboardingTask__c oBTask : oBTaskList) {
            OnboardingTemplateTask__c oBTemplateTask = new OnboardingTemplateTask__c();
            oBTemplateTask.OnboardingTask__c = oBTask.Id;
            oBTemplateTask.OnboardingTemplate__c = oBTemplate.Id;
            oBTemplateTaskList.add(oBTemplateTask);
        }

        return oBTemplateTaskList;
    }
}
