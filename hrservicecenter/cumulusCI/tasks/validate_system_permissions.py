from cumulusci.tasks.salesforce import BaseSalesforceApiTask


class ValidateSystemPermissions(BaseSalesforceApiTask):
    def _run_task(self):
        try:
            self.sf.query(f"SELECT IsPersonAccount FROM Account")
        except:
            self.return_values = False
            return self.return_values

        self.return_values = True
        return self.return_values
