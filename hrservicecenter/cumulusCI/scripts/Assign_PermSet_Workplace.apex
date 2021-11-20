// Assigns Employee Workspace Administrator to Sys Admin
String userId = UserInfo.getUserId();
String permSetId = [SELECT Id FROM PermissionSet WHERE Name='Employee_Workspace_Admin' LIMIT 1].Id;
List <PermissionSetAssignment> permSetCheck = [SELECT Id FROM PermissionSetAssignment WHERE PermissionSetId = : permSetId AND AssigneeId = : userId];
if (permSetCheck.size() == 0) {
    PermissionSetAssignment psa = new PermissionSetAssignment(PermissionSetId = permSetId, AssigneeId = userId);
    insert psa;
}