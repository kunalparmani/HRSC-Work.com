# Employee Workspace release process

The release process is now automated by using CircleCI for our continuous delivery flow to create release candidates (RC) that can be deployed to production. The whole process is activated via git tags.

In order to simplify that continuous delivery process, the Trunk Base Development approched has been choosen as a solution. There are still works in progress to achieve that.

### How to start the delivery flow

1. FF day

    - [ ] tag the main branch's commit that has been chosen to reference the start of feature freeze with `freeze-X.Y.Z`. This is only to mark the commit, no automation kicks in

    - [ ] bump main sfdx-project.json versionNumber to `(X+1).0.0.NEXT` and commit your change on the main branch

2. Beta package

    - [ ] go to the commit that was previously tagged with `freeze-X.Y.Z` and add an additional tag: `beta-X.Y.Z` => automation kicks in that runs the following CircleCi jobs before creating the beta package version on the main devHub:

        - integrate
        - functional-test
        - automation
        - create-package-version for Devint Dev Hub

    - The workflow is on hold on circleCI until one manager (members of the security group: [EW Beta Package approvers](https://github.com/orgs/CovidBackToWork/teams/ew-beta-package-approvers)) validate the workflow to continue the process

    - A slack notification has been sent to the ["work-digital-workspace-eng"](https://platformcloud.slack.com/archives/C017ZK3AAR0) slack channel to inform that an approval is needed

    - Once the job named "hold-for-package-creation-approval" has been approved: CircleCI kicks in and creates the beta package version on different devHub packages (backtowork & STMPB)

    - Make a Sanity test

        - [ ] Create a scratch org with no ancestors flag

        ```
        $ sfdx force:org:create -s -f config/project-scratch-def.json -a Sanity --noancestors --nonamespace
        ```

        - [ ] Import your org into CCI and run the flow used in meta-deploy to do the setup

        ```
        $ cci org import Sanity --org Sanity
        $ cci flow run install_and_configure --org Sanity -o install_managed__version <packageId> -o install_managed__password <InstallationKey>
        (Note: password is optional)
        ```

        - [ ] double-check that the package version has what it takes.
        - [ ] Alternatively: Follow the admin guide to set up the community and have everything you need for the sanity check: https://docs.google.com/document/d/1p620jNWj-bZZfn6In-QT-VRDfK2nPhNXKQSxW7KGDbo/edit#

    - [ ] In the cumulusci.yml file, update the `package version` used in the "install_managed" task with the version of the newly created beta package version.

        This informations can be found in the CircleCI `Create Beta Package for Dev Hub` job  
         -> `Log ckage version infos` task  
         -> `SubscriberPackageVersionId` field.

        Create a PR with the changes that will be merged on the main branch.

    - Create a realise on a tag on gitHub:

        - [ ] navigate to the [list of tags](https://github.com/CovidBackToWork/digitalworkspace/tags) in the EW repository
        - [ ] find the freeze tag that you created earlier and edit it -> "Edit release"
        - [ ] set the title with "Employee workspace \$VERSION_NUMBER"
        - [ ] set the body to:

        ```
        * Version id: $PACKAGE_ID
        * Installation link: https://login.salesforce.com/packaging/installPackage.apexp?p0=$PACKAGE_ID
        * Sandbox installation link: https://test.salesforce.com/packaging/installPackage.apexp?p0=$PACKAGE_ID
        * GUS version: $GUS_LINK_TO_VERSION_WORK_ITEMS
        ```

3. Metadeploy Employee Workspace release

This step goal is to publish cumulusCI related config files for Employee Workspace to MetaDeploy instances.

Everytime a PR is merge to the main branch in Employee Workspace repo, a copy is made to the `dev-int` branch of Metadeploy. This is done via circleCI automation using the following cci task: `github_copy_subtree`

Here are the steps to follow:

-   [ ] go to [Metadeploy repository](https://github.com/CovidBackToWork/metadeploy-digitalworkspace) and make sure your changes are there.

-   [ ] create a PR to merge changes from `dev-int` to `main` branch when we want to make release to MetaDeploy

-   [ ] Open a workitem for the DevOps team and notify them on the slack channel #work-devops to merge the PR and publish the new version to MetaDeploy staging

-   Create a package promotion request for DevOps

    -   [ ] Create a package promotion request from this [template](https://gus.lightning.force.com/lightning/r/ADM_Work__c/a07B0000008l3k0IAA/view) and here is an [example](https://gus.lightning.force.com/lightning/r/ADM_Work__c/a07AH000000AC7vYAG/view).
    -   [ ] Ask DevOps in the work-item to do the review for meta-deploy PR.
    -   [ ] Ask DevOps in the work-item to publish the new meta-deploy version in the staging environment.

4. Go for release

    - [ ] on the main branch, go to the latest commit that was tagged with `beta-X...`
    - [ ] tag again this commit with `release-X.0.0` => automation kicks in

    - An additional approval on circleCI is required (from members of the promotion security group [EW Package Promotion approvers](https://github.com/orgs/CovidBackToWork/teams/ew-package-promotion-approvers)) to continue the delivery flow and promote the package
    - A slack notification has been sent to the ["work-digital-workspace-eng"](https://platformcloud.slack.com/archives/C017ZK3AAR0) slack channel to inform that an approval in needed
    - Once the approval has been sent, CircleCI kicks in and promotes the beta package

The newly promoted package can be used for blitz / perf testing etc

-   Update the ancestorId field in the sfdx-config.json:

    -   in the circleCI flow named `Create Beta Package for Dev Hub` that was launched by the `beta` tag, in the `Log package version infos` job, find the value linked to the `Alias` field.
    -   [ ] use this new value to update the `packageAliases` section in the sfdx-config.json as well as the `ancestorId`
    -   [ ] commit your change and create a PR that will be merged to the main branch

-   Update the package upgrade reference in the sfdx-project.upgrade.json:

    -   on github, go to the commit that was used to bump the versionNumber `(X+1).0.0.NEXT` and find the CircleCI job attached to it that was launch when the PR was merged to the main branch.  
        This commit should correspond to the one tagged with `release`
    -   go to the `check-package-upgrade` job and find the `Subscriber Package Version Id` value in the `Create package version` step that correspond to the package version id
    -   [ ] ask your manager to promote this package version that will be used to check package upgrade in CirclCI jobs:

    ```
    sfdx force:package:version:promote -p <package version id> -v <the alias of the devOps devHub>
    ```

    -   [ ] use the same package version id value to update the `"Employee Workspace Upgrade@Ref"` field in the sfdx-project.upgrade.json file
    -   [ ] commit your change and create a PR that will be merged to the main branch

-   If changes need to be made on the promoted package due to issues that need to be fixed:

    -   [ ] create a fix branch just in time named ("vX-bug-fix" for example) from the commit that has been tagged with `beta-X.Y.Z`
    -   [ ] give a heads-up about it so everyone is aware of the new bug fix branch
    -   [ ] bump the patch version to `vX.0.1` for example, commit your change and create a PR to that new bug fix branch.  
             Here is an [example](https://github.com/CovidBackToWork/digitalworkspace/commit/309ecd655794ce6c39b1b462466cdeca66096c95)

    -   [ ] all bug fix should be first PR into the main branch and then cherry picked to the `vX-bug-fix` branch
    -   [ ] tag the last commit of the new branch with `beta-X.0.1`. The delivery process can continue to release once this package has been tested.

**Key points**

-   CircleCI is gating release stages
-   3 types of tags are used in this delivery flow:
    -   "freeze-X.Y.Z" => this is only to mark the commit, no automation kicks in
    -   "beta-X.Y.Z" => create a beta package version
    -   "release-X.Y.Z" => promote the beta package that has been created

**References**

-   Documentation on the subject:

    -   [Spike][alm] Define and Prototype a Release Candidate approach => https://salesforce.quip.com/nF6IAaQbDzqs
    -   [Spike] ALM - Assess and eventually evolve our Branching Strategy => https://salesforce.quip.com/O27uANnVh07a
    -   [ALM] - Releases Schedule & Application Lifecyle Management => https://salesforce.quip.com/OC5UAJG4NuCb

    _Beta package_: managed package dedicated for early testing. Generally a beta version is given to a limited audience so they can report bugs earlier. Those are not upgradable and they can only be deployed on sandboxes / tests environments furnished through the Environment Hub only.

    _Promoted package_: is a beta package that was promoted to the released state. Those can be push upgraded and progressively deployed to customers.

**How to tag a commit**

-   on a local branch:

    -   [ ] checkout the commit that you want to tag
    -   [ ] create a new tag, add it to the commit and push it on the remote branch

    ```
    NEW_TAG=<tag_name>-X.Y.Z && git tag $NEW_TAG && git push origin $NEW_TAG --no-verify
    ```
