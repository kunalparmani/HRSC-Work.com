# How to release a major or minor package version

This is the major/minor release checklist, to be automated one day.

**Prerequisites**:

-   Your Default DevHub must be defined to **backtowork.devhub.org**

**References**:

-   \$GUS_LINK_TO_VERSION_WORK_ITEMS is the link to GUS page listing the Work Items associated to the Release Tag - (ex.: wkdw-ew.5.0.0 => https://gus.lightning.force.com/lightning/r/a06B00000029XalIAE/related/Scheduled_Build__r/view)
-   \$RELEASE_VERSION is the external facing version (ex.: v0.5)
-   \$VERSION_NUMBER is the technical package number (ex.: 5.0.0.2)

### 1. PR from main to release-int

(this step is not needed to release a minor package version)

-   [ ] Fetch latest changes: `git checkout main && git pull && git fetch --tags`
-   [ ] Create a new pull request to request merging `main` in `release-int`. The PR should look like this:

**Title:**

```
Promote dev to release
```

**Body:**

```
Merges v$RELEASE_VERSION changes to release-int $GUS_LINK_TO_VERSION_WORK_ITEMS.

Reminder: this PR should not be squashed, a merge commit should be created instead.
```

-   [ ] Ask for PR Approvals and Merge PR

### 2. Set the version and PR the changes to prerelease

-   [ ] Check the version and ancestorId in `sfdx-project.json` on **release-int**: if not the correct X.Y.Z.NEXT then update sfdx-project.json (ALL versions occurences) with '[skip ci]' in the commit msg
-   [ ] Create a new pull request to request merging `release-int` in `prerelease`. The PR should look like this:
        **Title:**

```
Promote $RELEASE_VERSION to prerelease
```

**Body:**

```
Merges $RELEASE_VERSION changes to prerelease $GUS_LINK_TO_VERSION_WORK_ITEMS.

Reminder: this PR should not be squashed, a merge commit should be created instead.
```

-   [ ] If you want to add an installation Key : Add an INSTALLATION_KEY_ARG in CircleCI Environment variable for the **digitalworkspace** Project : https://app.circleci.com/settings/project/github/CovidBackToWork/digitalworkspace/environment-variables

```
You can generate a new password with 16 chars Upper and Lower Cases, with numbers (avoid misleading O, 0, 1, I, L) using LastPass or your preferred tool.

The environment variable format is [-k <YourInstallationKey>] without the brackets
```

-   [ ] If you do not want to have an installation Key : delete the existing INSTALLATION_KEY_ARG and create a new one with the value set to `-x` in CircleCI Environment variable for the **digitalworkspace** Project : https://app.circleci.com/settings/project/github/CovidBackToWork/digitalworkspace/environment-variables

-   You will need the approval of 2 managers to have this PR ready to be merged. Please refer to the following doc to get the proper approval: https://salesforce.quip.com/FIctAzQG1UOV

### 3. Merge to prerelease, This is where the package is created

-   [ ] Hit the green **Merge** button. The CI will create a new package version.

    > ***
    >
    > **IMPORTANT**:
    > **Never squash**, select the **"Create a merge commit"** option instead
    >
    > ***

-   [ ] Get the created \$VERSION_NUMBER (ex: 2.0.0.3) from circle-ci jobs log or running `sfdx force:package:version:list` on your local environment
-   [ ] Get the created \$PACKAGE_ID (ex.: 04t4R000001DlT2QAK) from circle-ci jobs log or running `sfdx force:package:version:list` on your local environment

-   [ ] Update the following doc with the new \$VERSION_NUMBER and \$PACKAGE_ID: https://salesforce.quip.com/nXTXABiM3mIO#LRJACAPwTHy

### 4. Update PackageId for Meta-Deploy

-   [ ] Update the packageId in the CCI task `install_managed` on main.

### 5. Make a Sanity test

-   [ ] Create a scratch org with no ancestors flag

```
$ sfdx force:org:create -s -f config/project-scratch-def.json -a Sanity --noancestors --nonamespace
```

-   [ ] Import your org into CCI and run the flow used in meta-deploy to do the setup

```
$ cci org import Sanity --org Sanity
$ cci flow run install_and_configure --org Sanity -o install_managed__version <packageId> -o install_managed__password <InstallationKey>
  (Note: password is optional)
```

-   [ ] double-check that the package version has what it takes.
-   [ ] Alternatively: Follow the admin guide to set up the community and have everything you need for the sanity check: https://docs.google.com/document/d/1p620jNWj-bZZfn6In-QT-VRDfK2nPhNXKQSxW7KGDbo/edit#

### 6. Create a GitHub release

-   [ ] Open https://github.com/CovidBackToWork/digitalworkspace/releases & hit "**Draft a new release**"
-   [ ] In `tag version`, enter tag `wkdw.$VERSION_NUMBER` (ex: `wkdw.2.0.0.3`)
-   [ ] Select the `prerelease` branch in the dropdown
-   [ ] Set the release title to `$RELEASE_VERSION ($VERSION_NUMBER candidate)` (ex: `2.0.0 (2.0.0.3 candidate)`)
-   [ ] Set the body to:

```
# Employee workspace v$VERSION_NUMBER

* Version id: $PACKAGE_ID
* Installation link: https://login.salesforce.com/packaging/installPackage.apexp?p0=$PACKAGE_ID
* Sandbox installation link: https://test.salesforce.com/packaging/installPackage.apexp?p0=$PACKAGE_ID
* GUS version: $GUS_LINK_TO_VERSION_WORK_ITEMS
```

### 7. Create a package promotion request for DevOps

-   [ ] Create a package promotion request from this template: https://gus.lightning.force.com/lightning/r/ADM_Work__c/a07B0000008l3k0IAA/view
-   [ ] Create a PR on [meta-deploy repository](https://github.com/CovidBackToWork/metadeploy-digitalworkspace) to promote meta-deploy to prerelease.
-   [ ] Ask DevOps in the work-item to do the review for meta-deploy PR.
-   [ ] Ask DevOps in the work-item to publish the new meta-deploy version in the staging environment.

### 8. Update Working environments:

-   [ ] Update `sfdx-project.json` in **release-int** with the new alias `"Employee Workspace@X.Y.Z-b": "$PACKAGE_ID"` and the **ancestorId** pointing to this new alias (this can only be done once the package version has been promoted)

-   [ ] Once the release-int modification has been automatically ported back to **main**, Update `sfdx-project.json` in **main** with the new version number `"versionNumber": "<NewVersion>.NEXT"` (ALL versions occurences), <NewVersion> being the next version U.V.0, given by PM.

-   If there are some conflicts during the automatic merge from release-int into main (on the ancestorId, packageAliases or the versionNumber): create a new branch from main, merge it on release-int `"git merge release-int"`, resolve the conflicts and create a new PR to update main properly.

### 9. Tell The world

-   [ ] Send A Post to Slack Channel #work-digital-workspace to inform stakeholders that the release is ready!

You're done!

### 3b. Need another version?

-   [ ] If you need another version, follow the patch release process on **release-int**.
        In brief, PR your fixes to **release-int**, and then as normal to **pre-release**.
        Any changes to release-int are auto-merged to main for you.
