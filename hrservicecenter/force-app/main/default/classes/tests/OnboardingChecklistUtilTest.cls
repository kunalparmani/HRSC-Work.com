/**
 * @author  Kunal Parmani
 * @date    5/17/21
 * @description Test Util class for OnboardingChecklist.
 * @log
 * -----------------------------------------------------------------------------
 * Date        Developer            Description
 * -----------------------------------------------------------------------------
 * 4/16/21     kunal parmani
 * 5/27/21     rkolasinski          W-000103 - Updates related to new data model.
 */
@IsTest
public class OnboardingChecklistUtilTest {
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

    public static List<OnboardingTask__c> createOnboardingTasks(
        List<String> flowNameList
    ) {
        List<OnboardingTask__c> onboardingTasks = new List<OnboardingTask__c>();
        for (String flowName : flowNameList) {
            OnboardingTask__c onBoardOption = new OnboardingTask__c();
            onBoardOption.StartDayOffset__c = 7;
            onBoardOption.FlowAPIName__c = flowName;
            onBoardOption.Name = flowName + ' Label';
            onBoardOption.Description__c =
                'Description placeholder for ' + flowName;
            onboardingTasks.add(onBoardOption);
        }

        insert onboardingTasks;
        return onboardingTasks;
    }

    public static List<Task> createTasks(
        List<OnboardingTask__c> onboardingTasks,
        Id ownerId
    ) {
        List<Task> taskList = new List<Task>();
        Id onboardingTaskRecordTypeId = Schema.SObjectType.Task.getRecordTypeInfosByDeveloperName()
            .get(OnboardingChecklist.ONBOARDING_TASK_RECORD_TYPE_DEVELOPER_NAME)
            .getRecordTypeId();

        for (OnboardingTask__c onboardingTask : onboardingTasks) {
            Task employeeTask = new Task();
            employeeTask.Status = 'New';
            employeeTask.WhatId = onboardingTask.Id;
            employeeTask.RecordTypeId = onboardingTaskRecordTypeId;
            employeeTask.OwnerId = ownerId;
            taskList.add(employeeTask);
        }

        insert taskList;
        return taskList;
    }
}
