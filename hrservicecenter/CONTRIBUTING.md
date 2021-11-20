# Contributing

When contributing to this repository, please first discuss the change you wish to make via issue, email, or any other method with the owners of this repository before making a change.

Feel free to raise any concern about this contributing guide with the workspace team. The goal is to improve our standards, and feedbacks are very welcome.

## Before you start

-   Please make sure you've followed the README's QuickStart section & installed our project tooling
-   A `pre-push` git hook will prevent you to push code that violates code style, or break tests. If you a blocked by a rule, you can:
    -   99% of the time, fix the problem. `npm run prettier` will format the files for you btw.
    -   add an ESLint exception in your code. Sometimes, we have to but not often.
    -   make our ESLint ruleset evolve. In this case, that's a team discussion.
    -   change prettier rules to make our standard evolve. In this case, it's a team discussion.

## Pull request process

Before your start creating your PR, please remind some best practices the team enforces:

-   **We aim to keep PR small and short**. Basically, a change with more than 20 files might show that you're doing too much stuff in your branch.
-   It's totally fine to merge multiple PRs for the same work item, we enforce earlier integration instead of creating silo branches
-   We're ok to review draft code, if the PR is in "draft" mode
-   If your PR is an architecture change, please reach out to the team first. That would be a total waste of time to re-do everything because your change doesn't goes along with the team's decisions.

When creating a pull request, you're ask to fill-in a PR template. Please fill this in properly, adding rich content (such as gif demos) is always appreciated.

### Branches

For the moment, we manage 2 types of branches:

-   Features, they are reintegrated to the `main` branch, therefore your branches should be created from the latest version of `main`.
-   Pre-release fixes, they are reintegrated to the `prerelease` branch.

In any case, keep your branch up-to-date, as recommended in [branch guide & routines](doc/branch-guide.md).

Branch names should reveal the type of change you're making. For the moment, we try to respect the following pattern

-   `feature`/blabla - this corresponds to a feature, or a piece of a feature. It contains something that works, but it's not necessary fulfilling a story's acceptance criteria.
-   `fix`/blabla - this is a bug-fix. If you find a typo, or if there's a major bug in the app, the branch should start with this prefix.
-   `tech`/blabla - this is a technical change. It doesn't add any functionality to the product. It can be a simple refactor (files rename), or an architecture change (folders layout, new pattern)
-   `doc`/blabla - this is a project documentation change. If you're writing docs (such as this contributing guide), it's the right prefix to use. It doesn't mean you cannot update any doc file in a `feature` or `fix` though.

As always, those are guidelines to make our life easier, especially when we need to cleanup the repo.

### Merging

We use the **"Squash and merge"** option when we merge pull requests. This means we won't keep your commits, and merge everything in a single one. This commit is then added at the top `main`, making the tree almost flat (and therefore easy to read & maintain).

### Reviewing

We don't have strict guidelines regarding PR comments. However, always consider those best practices:

-   Be clear in your comments, and make complete sentences. Avoid single words like _"lol"_ (for ok boomers), and always be constructive.
-   Try to suggest an alternative if you find something you find "blocking"
-   Be gentle, of course!

Some of use looked at formatting our comments like in https://conventionalcomments.org/, but it's not a team practice.

## Steps to create a PR

1. Add the ssh key as specified in the [doc](https://docs.github.com/en/github/authenticating-to-github/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account)
2. Add the GPG keys as specified in the [doc](https://docs.github.com/en/github/authenticating-to-github/managing-commit-signature-verification/adding-a-new-gpg-key-to-your-github-account)
3. Get the Repo `git clone git@github.com:CovidBackToWork/hrservicecenter.git`
4. Create a new branch using the command : `git checkout -b "YOUR-BRANCH-NAME"`
5. make changes as required on the branch
6. run prettier using `npm run prettier`
7. Add and Commit your changes

Before pushing the changes

1. Checkout main: `git checkout main`
2. get the latest changes: `git pull --rebase`
3. Checkout your branch : `git checkout "YOUR-BRANCH-NAME"`
4. rebase with main: `git rebase main`
5. if you have multiple commits, please squash and merge all the commits into one commit using [doc](https://salesforce.quip.com/w1bKAKSxeknV)
6. run prettier using `npm run prettier`
7. Push the changes using the command `git push -f origin YOUR-BRANCH-NAME`

## Code style & patterns

### Code style / Static checks

Code style & static code checks are enforced by using `prettier`, `eslint` & to enforce that the source code is meeting standards. There's still a work in progress to use PMD/Checkmarks for Apex as well, but it's not done yet.

Basically, we recommend the installation of 2 VSCode plugins to help you running `prettier` & `eslint` as you code:

-   ESLint: https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint
-   prettier: https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode

Code style is configured in the following files:

-   .prettierc & .prettierignore for prettier
-   force-app/.eslintrc.json for ESLint

### Test pattern: SUT (System Under Test) + AAA (Arrange Act Assert)

For Apex tests, you'll find the following patterns applied (almost!) everywhere:

-   SUT (System Under Test): The goal is to quickly identify what object is being tested. To do so, we name the variable representing the tested system `sut`.
-   AAA (Arrange Act Assert): The goal is to separate the preconditions (the given), from the action (the when) and the assertions (the then) by putting those phases as comments in the test. Basically, this helps us to build better tests and have a repeatable way of writing any kind of test. Note that all tests do not always have `// Arrange` and / or `// Act` depending on their nature.

Example:

```apex
@isTest
public static void test_givenNoContentFound_itReturnNotContentBannerDescription() {
    // Arrange
    BannerContentServiceFakeImpl service = new BannerContentServiceFakeImpl();
    service.stubResult = BannerContentResult.noContent();
    BannerController sut = new BannerController(service);

    // Act
    Banner result = sut.doGetBanner('20Y3E0000008OPfUAM');

    // Assert
    System.assertEquals(Banner.Statuses.NO_CONTENT.name(), result.status);
    System.assertEquals(null, result.title);
    System.assertEquals(null, result.body);
}
```

### Jest test patterns: BDD (Behavior Driven Development) style

For Jest tests, we use a BDD style syntax where we nest `describe` statements to reflect the feature "branches". Therefore, lots of tests won't have the `// Act` phase as they're defined in the `beforeEach()` hooks.

A quick example:

```
describe('FooComponent', () => {
    let sut;

    beforeEach(() => {
        sut = new Sut(); // can be a webcomponent as well
    });

    it('displays foo, () => {
        // Assert
    });

    describe('when the page is blue', () => {
        beforeEach(() => {
            document.body.style = 'background: blue';
        });

        it('displays bar', () => {
            // Act (tipically you would have something that refreshes the component)
            // Assert

        });
    });
});
```

### Test patterns: builders

We don't benefit from a 3rd party library (yet) to create our test fixtures (some languages does have 3rd party libs that help doing that, like AutoFixture for C# https://github.com/AutoFixture/AutoFixture).

In order to keep tests simple regarding creating data fixtures (generally partially filled-in model instances), we use the builder pattern.

> There be dragons here: if you don't need to build a complex object, or conditionally build some of its properties, you can avoid using this pattern.

Example:

```
@isTest
public static void buildFrom_should_populates_data_from_User() {
    // Arrange
    final User user = new Test_UserBuilder()
        .withAboutMe('This is my bio')
        .withMediumPhotoUrl('myPic.jpg')
        .withMediumBannerPhotoUrl('bannerPic.jpg')
        .build();

    // Act
    final EmployeeProfile employeeProfile = EmployeeProfileServiceImpl.buildEmployeeProfile(
        user,
        new Employee()
    );

    // Assert
    System.assertEquals('This is my bio', employeeProfile.aboutMe);
    System.assertEquals('myPic.jpg', employeeProfile.mediumPhotoUrl);
    System.assertEquals(
        'bannerPic.jpg',
        employeeProfile.mediumBannerPhotoUrl
    );
}
```
