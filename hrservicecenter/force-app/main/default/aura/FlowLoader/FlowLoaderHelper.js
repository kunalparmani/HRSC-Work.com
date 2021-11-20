({
    checkOnboardingFeaturesAccess: function (cmp) {
        return new Promise(
            $A.getCallback((resolve, reject) => {
                const action = cmp.get("c.hasOnboardingAccess");

                action.setCallback(this, function (response) {
                    const state = response.getState();
                    if (state === "SUCCESS") {
                        const hasOnboardingAccess = response.getReturnValue();
                        cmp.set("v.hasOnboardingAccess", hasOnboardingAccess);
                        resolve(hasOnboardingAccess);
                    } else {
                        reject(
                            console.log(
                                "Failed to check onboarding features access: " +
                                    state
                            )
                        );
                    }
                });

                $A.enqueueAction(action);
            })
        );
    },

    handleMessageChannelEvent: function (cmp, taskId, flowAPIName) {
        cmp.set("v.taskId", taskId);
        cmp.set("v.flowAPIName", flowAPIName);

        // reset the lightning:flow element
        cmp.set("v.hasFlow", false);
        cmp.set("v.hasFlow", true);
    },

    getTaskIdFromUrl: function () {
        return window.location.hash.split("#")[1];
    },

    setFlowAPIName: function (cmp, taskId) {
        var onboardingChecklistService = cmp.find("onboardingChecklistService");
        if (onboardingChecklistService) {
            onboardingChecklistService.getFlowAPIName(taskId).then((result) => {
                if (result) {
                    cmp.set("v.flowAPIName", result);
                    cmp.set("v.hasFlow", true);
                }
            });
        }
    },

    startFlow: function (cmp) {
        cmp.find("flowControl").startFlow(cmp.get("v.flowAPIName"), [
            {
                name: "taskId",
                type: "String",
                value: cmp.get("v.taskId")
            }
        ]);
    }
});
