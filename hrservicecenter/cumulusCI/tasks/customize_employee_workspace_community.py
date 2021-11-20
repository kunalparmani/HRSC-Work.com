from cumulusci.tasks.salesforce import BaseSalesforceApiTask
from cumulusCI.tasks.utils import get_id_from_soql_result

class CustomizeEmployeeWorkspaceCommunity(BaseSalesforceApiTask):
    task_options = {
        "community_name": {
            "description": "The community name to which members are assigned",
            "required": True
        },
        "profile_name": {
            "description": "The profile name with which members are assigned",
        },
        "permset_name": {
            "description": "The permset name with which members are assigned",
        }
    }

    def _run_task(self):
        community_name = self.options.get("community_name")
        profile_name = self.options.get("profile_name", "")
        permset_name = self.options.get("permset_name", "")


        if not profile_name and not permset_name:
            self.logger.error(f"{self.__class__.__name__} requires the options (profile_name) or (permset_name) and no values were provided")
            return


        community_id = self._get_community_id_by_name(community_name)

        if profile_name:
            self.logger.info(f"Assigning {profile_name} to {community_name}")
            self._assign_profile_to_community(community_id, profile_name)
        elif permset_name:
            self.logger.info(f"Assigning {permset_name} to {community_name}")
            self._assign_permset_to_community(community_id, permset_name)

        self.logger.info(f"Updating {community_name} settings")
        self._update_community_settings(community_id)


    def _get_community_id_by_name(self, community_name):
        return get_id_from_soql_result(
            self.sf.query(f"SELECT Id FROM Network WHERE Name='{community_name}'")
        )

    def _assign_profile_to_community(self, community_id, profile_name):
        profile_id = self._get_profile_id_by_name(profile_name)
        self._add_network_members(community_id, profile_id)

    def _get_profile_id_by_name(self, profile_name):
        return get_id_from_soql_result(
            self.sf.query(f"SELECT Id FROM Profile WHERE Name='{profile_name}'")
        )

    def _assign_permset_to_community(self, community_id, permset_name):
        permset_id = self._get_permset_id_by_name(permset_name)
        self._add_network_members(community_id, permset_id)

    def _get_permset_id_by_name(self, permset_name):
        return get_id_from_soql_result(
            self.sf.query(f"SELECT Id FROM PermissionSet WHERE Name='{permset_name}'")
        )

    def _add_network_members(self, community_id, parent_id):
        self.sf.NetworkMemberGroup.create(
            {
                "NetworkId": community_id,
                "ParentId": parent_id
            }
        )

    def _update_community_settings(self, community_id):
        self.sf.Network.update(
            community_id,
            {
                "OptionsAllowInternalUserLogin": "true",
                "OptionsNicknameDisplayEnabled": "false"
            }
        )
