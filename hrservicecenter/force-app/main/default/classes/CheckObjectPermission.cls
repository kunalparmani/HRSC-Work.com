public with sharing class CheckObjectPermission {
    public final static String NO_ACCESS_INDICATOR = 'No';
    public final static String YES_ACCESS_INDICATOR = 'Yes';

    /**
     * Checks Object permissions for wkdw__OnboardingTemplate__c,wkdw__OnboardingTemplateTask__c,wkdw__OnboardingTask__c
     * @return A List<RequestOutput> representing result of the API callout.
     */
    @InvocableMethod(
        Label='Check Object Permission'
        Description='Invokes the apex method to check the Object permissions for wkdw__OnboardingTemplate__c,wkdw__OnboardingTemplateTask__c,wkdw__OnboardingTask__c'
        Category='Direct Deposit'
    )
    public static List<RequestOutput> checkObjectsPerm() {
        String errorMessage = '';
        List<RequestOutput> requestOutputs = new List<RequestOutput>();
        RequestOutput requestOutput = new RequestOutput();

        if (!Schema.SObjectType.OnboardingTemplate__c.isAccessible()) {
            requestOutput.hasReadOnboardingTemplate = NO_ACCESS_INDICATOR;
            errorMessage = errorMessage + 'Onboarding Template,';
        }
        if (!Schema.SObjectType.OnboardingTemplateTask__c.isAccessible()) {
            requestOutput.hasReadOnboardingTemplateTask = NO_ACCESS_INDICATOR;
            errorMessage = errorMessage + 'Onboarding Template Task,';
        }
        if (!Schema.SObjectType.OnboardingTask__c.isAccessible()) {
            requestOutput.hasReadOnboardingTask = NO_ACCESS_INDICATOR;
            errorMessage = errorMessage + 'Onboarding Task,';
        }

        if (errorMessage.endsWith(',')) {
            errorMessage = errorMessage.substring(0, errorMessage.length() - 1);
        }

        requestOutput.errorMessage = String.format(
            Label.Object_Permissions_Error_Message,
            new List<String>{ errorMessage }
        );
        requestOutputs.add(requestOutput);

        return requestOutputs;
    }

    /**
     * Wrapper class for RequestOutput data.
     */
    public class RequestOutput {
        @InvocableVariable
        public String hasReadOnboardingTemplate = YES_ACCESS_INDICATOR;
        @InvocableVariable
        public String hasReadOnboardingTemplateTask = YES_ACCESS_INDICATOR;
        @InvocableVariable
        public String hasReadOnboardingTask = YES_ACCESS_INDICATOR;
        @InvocableVariable
        public String errorMessage;
    }
}
