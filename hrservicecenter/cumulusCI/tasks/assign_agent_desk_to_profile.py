from typing import Optional
from cumulusci.tasks.metadata_etl import MetadataSingleEntityTransformTask
from cumulusci.utils.xml.metadata_tree import MetadataElement
from cumulusci.core.utils import process_list_arg

class AssignAgentDeskToProfile(MetadataSingleEntityTransformTask):
    entity = "Profile"
    task_options = {
        **MetadataSingleEntityTransformTask.task_options,
    }

    def _transform_entity(
        self, metadata: MetadataElement, api_name: str
    ) -> Optional[MetadataElement]:

        ## Check app assignment
        appVis = metadata.find("applicationVisibilities", application="Agent_Desk")
        if not appVis:
            appVisElement = metadata.append("applicationVisibilities")
            appVisElement.append("application", "Agent_Desk")
            appVisElement.append("default", "true")
            appVisElement.append("visible", "true")
        
        return metadata