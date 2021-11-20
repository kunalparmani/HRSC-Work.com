from cumulusci.tasks.salesforce import BaseSalesforceApiTask

task_options = {
    "user_licenses": {
        "description": "Required user licenses",
        "required": True
    }
}

class ValidateUserLicenses(BaseSalesforceApiTask):
    def _run_task(self):
        required_user_licenses = self.options.get("user_licenses")
        if required_user_licenses is None:
            self.logger.warn("Warning: Empty user_licenses parameter, defaulting to valid")
            self.return_values = True
            return self.return_values

        user_license_labels = self._get_user_license_labels(self.sf.query(f"SELECT MasterLabel FROM UserLicense"))

        ## Check for required user licenses
        for user_license in required_user_licenses:
            if user_license not in user_license_labels:
                self.return_values = False
                return self.return_values

        self.return_values = True
        return self.return_values

    def _get_user_license_labels(self, query_result):
        labels = []
        if query_result and query_result["records"]:
            for record in query_result["records"]:
                labels.append(record["MasterLabel"])
        return labels
