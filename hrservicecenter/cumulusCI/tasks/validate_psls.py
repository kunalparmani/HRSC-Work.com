from cumulusci.tasks.salesforce import BaseSalesforceApiTask

task_options = {
    "permission_set_licenses": {
        "description": "Required permission set licenses",
        "required": True
    }
}

class ValidatePSLs(BaseSalesforceApiTask):
    def _run_task(self):
        psl_names = self._get_psl_names(self.sf.query(f"SELECT DeveloperName FROM PermissionSetLicense"))

        required_psls = self.options.get("permission_set_licenses")

        ## Check for required PSLs
        for psl in required_psls:
            if psl not in psl_names:
                self.return_values = False
                return self.return_values

        self.return_values = True
        return self.return_values

    def _get_psl_names(self, query_result):
        names = []
        if query_result and query_result["records"]:
            for record in query_result["records"]:
                names.append(record["DeveloperName"])
        return names
