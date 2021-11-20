# Automation Docs (Robot Framework) 🤖

## Installation

Follow: https://github.com/CovidBackToWork/workdotcom/tree/dev-int/robot#prereqs

## Running tests

1. Create a new scratch org (you can use [cci](https://github.com/CovidBackToWork/digitalworkspace#cumulusci---automated-scratch-org-configuration))
2. Run your tests using the `$ cci task run robot` command. You can specify test suits, test names and tags as options. Run this for the full list: `$ cci task run robot --help`

Have a look at some examples of running tests here: https://github.com/CovidBackToWork/workdotcom/tree/dev-int/robot#some-examples-of-running-tests

## Contributing

🖖 👉 New contributor? Your journey starts here: [CONTRIBUTING guide](../CONTRIBUTING.md)

### [Page Objects](https://cumulusci.readthedocs.io/en/latest/robotframework.html#pageobjects-library)

Page objects is the place where you can locate page elements and define actions that will be used in tests.

### [Keywords](https://github.com/robotframework/QuickStartGuide/blob/master/QuickStart.rst#keywords)

You can define your own python keywords, see example [here](robot/digitalworkspace/resources/lib/keywords/WorkExperience.py) and python datamodel to run SOQL query, see example [here](robot/digitalworkspace/resources/lib/keywords/datamodel/EmployeeWorkExperience.py).
Feel free to use Robot keyword as well, but please use Python keywords to query / modify records.

### [Test Cases](https://cumulusci.readthedocs.io/en/latest/robotframework.html#example-robot-test)

Robot Framework test cases are created using a keyword-based syntax. Write your test cases and use what you already defined in Page Objects & Keywords.

### [Variables](https://github.com/robotframework/QuickStartGuide/blob/master/QuickStart.rst#variables)

Define variables and use them in your tests. Also, you can override variables from command line when running robot from cci with the `vars` option:

```sh
$ cci task run robot -o suites ./my-test-suite.robot -o vars BROWSER:chrome,USERNAME:hamilton
```

Check [Resources](#Resources) for more details.

### Useful vscode plugins for development with robot

-   [Python](https://marketplace.visualstudio.com/items?itemName=ms-python.python) helps with formatting and detecting syntax errors.
-   [Robot Framework Intellisense](https://marketplace.visualstudio.com/items?itemName=TomiTurtiainen.rf-intellisense) helps to navigate from robot files to corresponding python methods (Follow documentation to set it up and get to know some tricks)
    Your VSCode `settings.json` should look like this:

```json
{
    ...
    "rfLanguageServer.includePaths": [
        "**/*.robot",
        "**/*.py"
    ],
    "rfLanguageServer.libraries": [
        "Selenium2Library-3.0.0"
    ]
    ...
}
```

### XPath Queries

It is a good practice to make your xpath queries specific, but not to the point that it becomes very dependent on components internal structure.

For instance, this is a good query as it should retrieve only the edit button of the employee profile card component:

```xpath
//employee-profile-card//*[@class='edit__button']
```

While this query could retrieve multiple results

```xpath
//button[@class='edit__button']
```

And this one is very dependent on the component internal structure

```xpath
//employee-profile-card/div/div/button[@class='edit__button']
```

#### Namespace

Usually, exposed components coming from a package that is installed on a non namespaced org are represented as:

```xml
    c-<component-name>   i.e. c-employee-profile-card
```

While on a namespaced org they become:

```xml
    <namespace>-<component-name>   i.e. wkdw-employee-profile-card
```

Keep in mind that this doesn't apply to non exposed components as they use the `c-**` prefix in both cases.

## Resources

-   [Robot quick start guide](https://github.com/robotframework/QuickStartGuide/blob/master/QuickStart.rst)
-   [Command Center Robot tests](https://github.com/CovidBackToWork/workdotcom/tree/dev-int/robot)
-   [Selenium2Library](https://robotframework.org/Selenium2Library/Selenium2Library.html)
-   [Salesforce utilities for Robot framework (Confluence)](https://confluence.internal.salesforce.com/display/SFDOIDP/Robot+Framework+Home)
-   [CumulusCI utilities for Robot framework](https://cumulusci.readthedocs.io/en/latest/robotframework.html)
