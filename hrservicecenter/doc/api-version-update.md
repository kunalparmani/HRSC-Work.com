# API Version Update

This doc describes the steps needed to upgrade the API version in APEX classes and Salesforce metadata, when a new version is available.

1. Install this [sfdx-plugin](https://github.com/muenzpraeger/sfdx-plugin#sfdx-mzprsourceapiset) to help you updating the API version.
2. Run `sfdx mzpr:source:api:set` to update the "force-app" directories to the latest version available in the dev-hub.
3. (Alternatively) In case you want to update with a specific version run: `sfdx mzpr:source:api:set --apiversion=<your_version>, ex: 51.0`
4. Make sure that all files are migrated to the new version. You might have to update some of them manually, including:
    - unpackaged metadata files
    - APEX/Python/SH or any other scripts
    - `package.xml` files
    - `sfdx-project.json` and `sfdx-project.upgrade.json`
    - And maybe more..
5. Update the necessary dependencies in the `project.json`, probably including:
    - @salesforce/eslint-config-lwc
    - @salesforce/sfdx-lwc-jest
    - eslint
    - ...
