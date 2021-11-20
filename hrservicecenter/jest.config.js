const { jestConfig } = require("@salesforce/sfdx-lwc-jest/config");

module.exports = {
    ...jestConfig,
    clearMocks: true,
    moduleNameMapper: {
        "^c/flowOnboardingPageHeaderContact$":
            "<rootDir>/force-app/test/jest-mocks/c/flowOnboardingPageHeaderContact/flowOnboardingPageHeaderContact",
        "^c/onboardingChecklistTask$":
            "<rootDir>/force-app/test/jest-mocks/c/onboardingChecklistTask/onboardingChecklistTask",
        "^lightning/messageService$":
            "<rootDir>/force-app/test/jest-mocks/lightning/messageService/messageService",
        "^lightning/flowSupport$":
            "<rootDir>/force-app/test/jest-mocks/lightning/flowSupport/flowSupport"
    },
    testPathIgnorePatterns: jestConfig.testPathIgnorePatterns.concat([
        "/dummy.*/",
        "digitalworkspace/*",
        "concierge/*"
    ])
};
