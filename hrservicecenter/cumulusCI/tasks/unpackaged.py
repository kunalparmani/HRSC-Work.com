from cumulusci.tasks.command import Command

SFDX_CLI = "sfdx"
class InstallLastEwPackage(Command):
    def _get_command(self):
        return "latestVersion=$(sfdx force:package:version:list -p '" + self.options["target_package"] + \
               "' -o CreatedDate --concise | tail -1 | awk '{print $3}') && sfdx " + self.options["command"] + \
               " -p ${latestVersion} -w 10 --installationkey 'dw1234' -u " + self.org_config.username
class InstallLastEcPackage(Command):
    def _get_command(self):
        return "latestVersion=$(sfdx force:package:version:list -p '" + self.options["target_package"] + \
               "' -o CreatedDate --concise | tail -1 | awk '{print $3}') && sfdx " + self.options["command"] + \
               " -p ${latestVersion} -w 10 --installationkey 'dw1234' -u " + self.org_config.username