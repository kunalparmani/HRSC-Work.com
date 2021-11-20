from cumulusci.tasks.salesforce import BaseSalesforceApiTask
from cumulusCI.tasks.utils import get_id_from_soql_result

class CreateMyTicketsNavItem(BaseSalesforceApiTask):
    def _run_task(self):
        community_name = "Employee Workspace Community"
        community_id = get_id_from_soql_result(self.sf.query(f"SELECT Id FROM Network WHERE Name='{community_name}'"))
        if community_id:
            default_nav_name = "Default Navigation"
            default_nav_id = get_id_from_soql_result(self.sf.query(f"SELECT Id FROM NavigationLinkSet WHERE NetworkId='{community_id}' AND MasterLabel='{default_nav_name}'"))
            if not default_nav_id:
                return
            
            ## Get all existing nav items under Default Navigation
            default_nav_items_result = self.sf.query(f"SELECT Label, Id FROM NavigationMenuItem WHERE NavigationLinkSetId='{default_nav_id}'")
            nav_items_dict = self._create_nav_item_dict(default_nav_items_result)
            num_nav_items = len(nav_items_dict)

            ## If My Tickets already exists, just return
            if "My Tickets" in nav_items_dict:
                return

            ## Create My Tickets
            self._create_nav_item(label="My Tickets", navigation_link_set_id=default_nav_id, 
                                position=num_nav_items+1, target="Case", item_type="SalesforceObject")
    
    ## organizes nav items into label : id dictionary
    def _create_nav_item_dict(self, query_result):
        label_id_dict = {}
        if query_result["totalSize"] > 0:
            records = query_result["records"]
            for rec in records:
                label_id_dict[rec["Label"]] = rec["Id"]
        return label_id_dict
    
    ## creates nav item with specified values
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