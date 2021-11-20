from cumulusci.tasks.salesforce import BaseSalesforceApiTask
from cumulusci.salesforce_api.metadata import ApiListMetadata
from cumulusci.utils import zip_subfolder, parse_api_datetime
from xml.dom.minidom import parseString

class SetupNavigationMenu(BaseSalesforceApiTask):
    def _run_task(self):
        community_name = "Employee Workspace Community"
        community_id = self._get_id_from_result(self.sf.query(f"SELECT Id FROM Network WHERE Name='{community_name}'"))
        if community_id:
            default_nav_name = "Default Navigation"
            default_nav_id = self._get_id_from_result(self.sf.query(f"SELECT Id FROM NavigationLinkSet WHERE NetworkId='{community_id}' AND MasterLabel='{default_nav_name}'"))
            if not default_nav_id:
                return
            
            ## Get all existing nav items under Default Navigation
            default_nav_items_result = self.sf.query(f"SELECT Label, Id FROM NavigationMenuItem WHERE NavigationLinkSetId='{default_nav_id}'")
            nav_items_dict = self._create_nav_item_dict(default_nav_items_result)

            ## Remove Topics navigation item if it exists
            if "Topics" in nav_items_dict:
                self.sf.NavigationMenuItem.delete(nav_items_dict["Topics"])

            ## Create the Profile and Apps menu items if they don't exist
            if "Profile" not in nav_items_dict:
                self._create_nav_item(label="Profile", navigation_link_set_id=default_nav_id, 
                                    position=1, target="/profile/home", item_type="InternalLink")
            if "Apps" not in nav_items_dict:
                self._create_nav_item(label="Apps", navigation_link_set_id=default_nav_id, 
                                    position=2, target="/apps", item_type="InternalLink")
    
    def _get_id_from_result(self, result):
        if result["totalSize"] > 0:
            record = result["records"][0]
            return record["Id"]
        return None
    
    def _create_nav_item_dict(self, query_result):
        label_id_dict = {}
        if query_result["totalSize"] > 0:
            records = query_result["records"]
            for rec in records:
                label_id_dict[rec["Label"]] = rec["Id"]
        return label_id_dict
    
    def _create_nav_item(self, label, navigation_link_set_id, 
                        position, target, item_type):
        self.sf.NavigationMenuItem.create(
            {
                "Label": label,
                "NavigationLinkSetId": navigation_link_set_id,
                "Position": position,
                "Target": target,
                "Type": item_type
            }
        )