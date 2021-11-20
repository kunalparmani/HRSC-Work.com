String userId = UserInfo.getUserId();
// Assigns EmployeeExperiencePsl to Sys Admin
String pslId = [SELECT Id FROM PermissionSetLicense WHERE DeveloperName = 'EmployeeExperiencePsl' LIMIT 1].Id;
List<PermissionSetLicenseAssign> pslCheck = [SELECT Id FROM PermissionSetLicenseAssign WHERE PermissionSetLicenseId = : pslId AND AssigneeId = : userId];
if (pslCheck.size() == 0) {
    PermissionSetLicenseAssign psla = new PermissionSetLicenseAssign(PermissionSetLicenseId = pslId, AssigneeId = userId);
    insert psla;
}
// Assigns EmployeeConciergePsl to Sys Admin
pslId = [SELECT Id FROM PermissionSetLicense WHERE DeveloperName = 'Employee360_EmployeeConciergePsl' LIMIT 1].Id;
pslCheck = [SELECT Id FROM PermissionSetLicenseAssign WHERE PermissionSetLicenseId = : pslId AND AssigneeId = : userId];
if (pslCheck.size() == 0) {
    PermissionSetLicenseAssign psla = new PermissionSetLicenseAssign(PermissionSetLicenseId = pslId, AssigneeId = userId);
    insert psla;
}
// Assign Concierge Access PSG to Sys Admin
String permSetId = [SELECT Id FROM PermissionSetGroup WHERE DeveloperName='EmployeeConciergeAccessGroup' LIMIT 1].Id;
List<PermissionSetAssignment> permSetCheck = [SELECT Id FROM PermissionSetAssignment WHERE PermissionSetGroupId = : permSetId AND AssigneeId = : userId];
if (permSetCheck.size() == 0) {
    PermissionSetAssignment psa = new PermissionSetAssignment(PermissionSetGroupId = permSetId, AssigneeId = userId);
    insert psa;
}