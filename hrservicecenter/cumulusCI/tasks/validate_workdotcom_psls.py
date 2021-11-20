from cumulusci.tasks.salesforce import BaseSalesforceApiTask

task_options = {}

class ValidatePSLs(BaseSalesforceApiTask):
    def _run_task(self):
        psl_names = self._get_psl_names(self.sf.query(f"SELECT DeveloperName FROM PermissionSetLicense"))

        if not ValidatePSLs._is_employee_experience_available(psl_names):
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

    @staticmethod
    def _is_employee_experience_available(psl_names):
        return "EmployeeExperiencePsl" in psl_names and "Employee360_EmployeeConciergePsl" in psl_names
