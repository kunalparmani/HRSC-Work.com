from cumulusci.tasks.salesforce import BaseSalesforceApiTask


class ValidateKnowledgeAddon(BaseSalesforceApiTask):
    def _run_task(self):
        try:
            self.sf.query(f"SELECT UserPermissionsKnowledgeUser FROM User")
        except:
            self.return_values = False
            return self.return_values

        self.return_values = True
        return self.return_values
