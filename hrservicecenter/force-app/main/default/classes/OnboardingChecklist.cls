public with sharing class OnboardingChecklist {
    private final static String TASK_STATUS_COMPLETED = 'Completed';
    @TestVisible
    private static final String ONBOARDING_TASK_RECORD_TYPE_DEVELOPER_NAME = 'OnboardingTask';

    /**
     * Queries a list of tasks assigned to a particular employee.
     * @param userId Id of the user.
     * @return A List<TaskWrapper> containing task details.
     */
    @AuraEnabled
    public static List<TaskWrapper> getTasks(Id userId) {
        Id onboardingTaskRecordTypeId = Schema.SObjectType.Task.getRecordTypeInfosByDeveloperName()
            .get(ONBOARDING_TASK_RECORD_TYPE_DEVELOPER_NAME)
            .getRecordTypeId();

        List<TaskWrapper> taskWrappers = new List<TaskWrapper>();

        List<Task> tasks = [
            SELECT Id, WhatId, OwnerId, Status, ActivityDate
            FROM Task
            WHERE
                OwnerId = :userId
                AND RecordTypeId = :onboardingTaskRecordTypeId
        ];

        if (tasks.size() > 0) {
            Set<Id> onboardingTaskIds = new Set<Id>();
            for (Task t : tasks) {
                onboardingTaskIds.add(t.WhatId);
            }

            List<OnboardingTask__c> onboardingTasks = [
                SELECT
                    Id,
                    Name,
                    Description__c,
                    FlowAPIName__c,
                    StartDayOffset__c
                FROM OnboardingTask__c
                WHERE Id IN :onboardingTaskIds
            ];

            for (OnboardingTask__c onboardingTask : onboardingTasks) {
                for (Task t : tasks) {
                    if (t.WhatId == onboardingTask.Id) {
                        TaskWrapper taskWrapper = new TaskWrapper();
                        taskWrapper.taskId = t.Id;
                        taskWrapper.status = t.Status;
                        taskWrapper.dueDate = t.ActivityDate;
                        taskWrapper.completed =
                            t.Status == TASK_STATUS_COMPLETED;
                        taskWrapper.label = onboardingTask.Name;
                        taskWrapper.description = onboardingTask.Description__c;
                        taskWrapper.flowAPIName = onboardingTask.FlowAPIName__c;
                        taskWrappers.add(taskWrapper);
                    }
                }
            }
            taskWrappers.sort();
        }
        return taskWrappers;
    }

    /**
     * Invokes a method responsible for querying the flow API name.
     * @param taskId Id of the task.
     * @return A String representing flow API name.
     */
    @AuraEnabled
    public static String getFlowAPINameApex(Id taskId) {
        Task selectedTask = [SELECT Id, WhatId FROM Task WHERE Id = :taskId];

        OnboardingTask__c onboardingTask = [
            SELECT Id, FlowAPIName__c
            FROM OnboardingTask__c
            WHERE Id = :selectedTask.WhatId
        ];

        return onboardingTask.FlowAPIName__c;
    }

    /**
     * Wrapper for the apex data type with task data.
     */
    public class TaskWrapper implements Comparable {
        @AuraEnabled
        public String taskId;

        @AuraEnabled
        public String label;

        @AuraEnabled
        public String description;

        @AuraEnabled
        public String flowAPIName;

        @AuraEnabled
        public String status;

        @AuraEnabled
        public Boolean completed;

        @AuraEnabled
        public Date dueDate;

        /**
         * Sorts a List<TaskWrapper> representing task data.
         * Compares the following fields: dueDate, label.
         * Sorts dates from the earliest to the latest and labels lexicographically.
         * If both dates are present, prioritizes the earlier one.
         * If a dueDate is missing on compareTo object, prioritizes the compared object.
         * If a dueDate is missing on compared object, prioritizes the compareTo object.
         * If both are missing, compares the labels.
         * @param compareTo An object current object will be compared to.
         * @return An Integer indicating whether the compared field value is lower, higher or equal.
         */
        public Integer compareTo(Object compareTo) {
            TaskWrapper recordToCompare = (TaskWrapper) compareTo;
            Integer result = 0;
            String labelComparedRecord = label.toLowerCase();
            String labelComparedToRecord = recordToCompare.label.toLowerCase();

            if (dueDate != null) {
                if (recordToCompare.dueDate != null) {
                    if (dueDate < recordToCompare.dueDate) {
                        result = -1;
                    } else if (dueDate > recordToCompare.dueDate) {
                        result = 1;
                    } else {
                        result = labelComparedRecord.compareTo(
                            labelComparedToRecord
                        );
                    }
                } else {
                    result = -1;
                }
            } else if (recordToCompare.dueDate != null) {
                result = 1;
            } else {
                result = labelComparedRecord.compareTo(labelComparedToRecord);
            }

            return result;
        }
    }
}
