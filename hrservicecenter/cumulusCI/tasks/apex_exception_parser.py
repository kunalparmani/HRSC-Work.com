from cumulusci.core.exceptions import ApexException
from cumulusci.tasks.apex.anon import AnonymousApexTask

class ApexExceptionParser(AnonymousApexTask):
    task_options = {
        "exception_name": {
            "description": "Exception that should make this task return False",
            "required": True
        }
    }

    def _run_task(self):
        try:
            super()._run_task()
        except Exception as err:
            if self.options.get("exception_name") in str(err):
                self.return_values = False
                return self.return_values
        self.return_values = True
        return self.return_values