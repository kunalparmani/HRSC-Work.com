public with sharing class OnboardingFeatureAccess {
    private static final String EMPLOYEE_PRODUCTIVITY_FEATURE_ACCESS = 'EmployeeProductivityPlusFeaturesAccess';
    /**
     * Checks whether or not the Onboarding features license is available.
     * @return A flag indicating license availability.
     */
    @AuraEnabled
    public static Boolean hasOnboardingAccess() {
        Boolean hasOnboardingAccess = FeatureManagement.checkPermission(
            EMPLOYEE_PRODUCTIVITY_FEATURE_ACCESS
        );
        return hasOnboardingAccess;
    }
}
