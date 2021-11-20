// Validate that correct permission sets were created
List<PermissionSet> ewAdminPermSetCheck = [SELECT Id FROM PermissionSet WHERE Name='Employee_Workspace_Admin' LIMIT 1];
List<PermissionSet> ewUserPermSetCheck = [SELECT Id FROM PermissionSet WHERE Name='Employee_Workspace_User_Data_Access' LIMIT 1];
if (ewAdminPermSetCheck.size() == 0 || ewUserPermSetCheck.size() == 0) {
    throw new EmployeeWorkspaceNotConfiguredException('EW_COMMUNITY_NOT_CONFIGURED');
}

// Validate that permission set assignments are configured
Id adminId = UserInfo.getUserId();
string ewAdminPermSetId = ewAdminPermSetCheck[0].Id;
List <PermissionSetAssignment> adminPermSetAssignmentCheck = [SELECT Id FROM PermissionSetAssignment WHERE PermissionSetId = :ewAdminPermSetId AND AssigneeId = :adminId];
if (adminPermSetAssignmentCheck.size() == 0) {
    throw new EmployeeWorkspaceNotConfiguredException('EW_COMMUNITY_NOT_CONFIGURED');
}

// Validate Community has been set up
/// validate configurations
Network network = [SELECT Name, Id, OptionsAllowInternalUserLogin, OptionsNicknameDisplayEnabled FROM Network WHERE Name='Employee Workspace Community'];
Boolean networkOptionsConfigured = network.OptionsAllowInternalUserLogin == true && network.OptionsNicknameDisplayEnabled == false;
/// validate member group through permset
Profile stdProfile = [
    SELECT Id
    FROM Profile
    WHERE Name = 'Standard Platform User'];

PermissionSet permSet = [
    SELECT Id
    FROM PermissionSet
    WHERE Name = 'workplace_user'];

List<NetworkMemberGroup> memberCheck = [SELECT AssignmentStatus, NetworkId, ParentId FROM NetworkMemberGroup WHERE NetworkId=:network.Id AND (ParentId=:stdProfile.Id OR ParentId=:permSet.Id)];
if (!networkOptionsConfigured || memberCheck.size() == 0) {
    throw new EmployeeWorkspaceNotConfiguredException('EW_COMMUNITY_NOT_CONFIGURED');
}

public class EmployeeWorkspaceNotConfiguredException extends Exception {
}