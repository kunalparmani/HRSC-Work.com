# HR Service Center

This repo contains the sources of the HR Service Center project, built on top of the salesforce platform.

## Prerequisite

This project relies on SFDX and therefore on NodeJS. Before jumping in, ensure you:

1. Setup NodeJS to use the LTS version. The _nvm_ project https://github.com/nvm-sh/nvm can be used to manage multiple NodeJS version, and has handy shortcuts to install LTS version of NodeJS
2. [Install SFDX](https://developer.salesforce.com/docs/atlas.en-us.sfdx_setup.meta/sfdx_setup/sfdx_setup_install_cli.htm)
3. [Install CumulusCI](https://cumulusci.readthedocs.io/en/latest/install.html#installing-cumulusci)

## QuickStart

To deploy the sources in a scratch org:

1. Clone this project

    ```bash
    git clone git@github.com:CovidBackToWork/hrservicecenter.git
    cd hrservicecenter
    ```

2. Install local development tools

    ```bash
    npm install
    ```

3. You need to use the dev-int DevHub as your default DevHub (backtoworkdev.my.salesforce.com) and set default user name
    ```bash
    sfdx force:auth:web:login -r https://backtoworkdev.my.salesforce.com -a DevHub
    sfdx force:config:set defaultdevhubusername=<your_DevHub_username>@dev-int.backtowork.devhub.org --global
    ```
4. Connect cci to your github account, you'll need this later:
    ```bash
     # this will ask you for a personal access token
     # you can add one in https://github.com/settings/tokens)
     cci service connect github
    ```
5. Use CumulusCI to create your scratch org (checkout CumulusCI section below)

## CumulusCI - Automated Scratch Org Configuration

### Dev Org

To work on this project in a scratch org for development.

1. Run `cci org scratch release <alias> --default` to create scratch org shell with dev config.

2. Run `cci flow run dev_org` to deploy this project.

3. Run `cci org browser <alias>` to open the org in your browser.

**Other useful commands:**

-   Run `cci org list` to display a full list of your scratch orgs
-   Run `cci org info <alias>` to get an given org details (username, password, ...)
-   Run `cci org scratch_delete <alias>` to delete a specific scratch org
-   Run `cci org default <alias>` to set a scratch org as the default one

**Tasks commands:**

-   Run `cci task run <task_name>` to run a specific task
-   Run `cci task run <task_name> -o param1 "v1" -o param2 "v2"` to run a specific task with parameters
-   Run `cci task list` to display all tasks

**Flows commands:**

-   Run `cci flow info dev_org` to display the dev cci flow
-   Run `cci flow run <flow_name>` to run a specific flow
-   Run `cci flow run <flow_name> -o <task_name>__<param> "Hello"` to run a specific flow with parameters. ex: `ci flow run my_flow -o my_task__param1 "Hello" -o my_task__param2 "World"`.
-   Run `cci flow list` to display all flows

_For the full list visit: https://cumulusci.readthedocs.io/en/latest/tutorial.html_

### QA Org

Alternative path for QA (source code deployment) and automated configuration (activated and published Community,
assign Sys Admin Perm Sets, etc).

1. Run `cci org scratch qa <alias> --default` to create scratch org shell with QA config.

2. Run `cci flow run qa_org` to deploy this project and deploy configs and settings.

3. Run `cci org browser <alias>` to open the org in your browser.

### Prod-like Org (managed package)

Alternative path for Prod-like (managed package install) and automated configuration (activated and published
Community, assign Sys Admin Perm Sets, etc).

1. Run `cci org scratch release <alias> --default` to create scratch org shell with release config.

2. Run `cci flow run install_prod` to deploy this project and deploy configs and settings.

3. Run `cci org browser <alias>` to open the org in your browser.

### QA-like Org (managed package)

Alternative path for QA-like (managed package install) and automated end-to-end robot testing

1. Run `cci org scratch release <alias> --default` to create scratch org shell with release config.

2. Run `cci flow run robot_testing` to deploy this project and deploy configs and settings.

3. Run `cci task run robot -o suites ./ -o vars BROWSER:chrome` to run robot tests.

## Meta-Deploy & CumulusCI Config

Refer to the [CumulusCI config guide](./cumulusCI/README.md)

## Automation

Refer to the [e2e automation guide](./doc/e2e-automation.md).

## Contributing

Before starting to contribute, please review the [contributing](CONTRIBUTING.md) guide.

## Other Documentation

-   [Step-by-step release](doc/prerelease.md)
-   [Design tokens usage](doc/design-tokens.md)
-   [Salesforce API Version Update](doc/api-version-update.md)
