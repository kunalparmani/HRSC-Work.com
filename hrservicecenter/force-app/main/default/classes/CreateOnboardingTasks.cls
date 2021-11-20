/**
 * @author  Kunal Parmani
 * @date    5/27/21
 * @description CreateOnboardingTasks class to Initiate Onboarding tasks for Employee.
 * @log
 * -----------------------------------------------------------------------------
 * Date        Developer
 * -----------------------------------------------------------------------------
 * 5/27/21     kunal parmani
 */
public with sharing class CreateOnboardingTasks {
    /**
     * Creates the onboarding tasks for the suplied onboarding templates.
     * @param requestInputs List<RequestInput> representing onboarding templates parameters.
     * @return A List<RequestOutput> representing result.
     */
    @InvocableMethod(
        Label='Create Onboarding Tasks'
        Description='Creates the onboarding tasks for the suplied onboarding templates.'
        Category='Onboarding Tasks'
    )
    public static List<RequestOutput> createTasks(
        List<RequestInput> requestInputs
    ) {
        List<Task> createTaskList = new List<Task>();
        List<Id> OBtaskIdList = new List<Id>();
        List<String> OBtemplateList = new List<String>();
        List<RequestOutput> requestOutputs = new List<RequestOutput>();
        Id recordTypeId = Schema.SObjectType.Task.getRecordTypeInfosByDeveloperName()
            .get('OnboardingTask')
            .getRecordTypeId();

        String OBStr = requestInputs[0].selectedTemplates;
        if (OBStr.contains('; ')) {
            OBStr = OBStr.replaceAll('; ', ';');
        }
        OBtemplateList = OBStr.split(';');

        if (!String.isEmpty(requestInputs[0].UserID)) {
            Employee employeeRecord = EmployeeCtrl.getEmployeeRecordByUserId(
                requestInputs[0].UserID
            )[0];

            for (Task tsk : [
                SELECT id, WhatId
                FROM Task
                WHERE OwnerId = :requestInputs[0].UserID
            ]) {
                if (!OBtaskIdList.contains(tsk.WhatId)) {
                    OBtaskIdList.add(tsk.WhatId);
                }
            }

            for (OnboardingTemplateTask__c OBtemplatetask : [
                SELECT
                    id,
                    OnboardingTask__c,
                    OnboardingTask__r.StartDayOffset__c,
                    OnboardingTask__r.Name,
                    OnboardingTask__r.Description__c
                FROM OnboardingTemplateTask__c
                WHERE OnboardingTemplate__r.Name IN :OBtemplateList
            ]) {
                if (!OBtaskIdList.contains(OBtemplatetask.OnboardingTask__c)) {
                    Task tsk = new Task();
                    Integer daysToAdd = Integer.valueOf(
                        OBtemplatetask.OnboardingTask__r.StartDayOffset__c
                    );

                    if (employeeRecord.StatusAsOf != null) {
                        tsk.ActivityDate = employeeRecord.StatusAsOf.date()
                            .addDays(daysToAdd);
                    } else {
                        tsk.ActivityDate = Date.today().addDays(daysToAdd);
                    }

                    tsk.Subject = OBtemplatetask.OnboardingTask__r.Name;
                    tsk.Description = OBtemplatetask.OnboardingTask__r.Description__c;
                    tsk.WhatId = OBtemplatetask.OnboardingTask__c;
                    tsk.Status = 'Not Started';
                    tsk.OwnerId = requestInputs[0].UserID;
                    tsk.recordtypeId = recordTypeId;

                    OBtaskIdList.add(OBtemplatetask.OnboardingTask__c);
                    createTaskList.add(tsk);
                }
            }

            try {
                insert createTaskList;

                RequestOutput reqOutput = new RequestOutput();
                reqOutput.total_Onboarding_Task = createTaskList.size();
                reqOutput.isSuccess = true;
                requestOutputs.add(reqOutput);
            } catch (Exception e) {
                RequestOutput reqOutput = new RequestOutput();
                reqOutput.total_Onboarding_Task = 0;
                reqOutput.isSuccess = false;
                reqOutput.errorMessage = e.getMessage();
                requestOutputs.add(reqOutput);

                throw new AuraHandledException(
                    'An error occurred while trying to insert employee Onboarding Task data: ' +
                    e.getMessage()
                );
            }
        } else {
            RequestOutput reqOutput = new RequestOutput();
            reqOutput.total_Onboarding_Task = 0;
            reqOutput.isSuccess = false;
            reqOutput.errorMessage = 'Employee does not have a user! Please assign a user to the employee!';
            requestOutputs.add(reqOutput);
        }

        return requestOutputs;
    }

    /**
     * Wrapper class for RequestInput data.
     */
    public class RequestInput {
        @InvocableVariable
        public String selectedTemplates;
        @InvocableVariable
        public String UserID;
    }

    /**
     * Wrapper class for RequestInput data.
     */
    public class RequestOutput {
        @InvocableVariable
        public Boolean isSuccess;
        @InvocableVariable
        public String errorMessage;
        @InvocableVariable
        public Integer total_Onboarding_Task;
    }
}
