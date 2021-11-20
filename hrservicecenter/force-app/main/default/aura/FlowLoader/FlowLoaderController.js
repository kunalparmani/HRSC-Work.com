({
    init: function (cmp, event, helper) {
        helper
            .checkOnboardingFeaturesAccess(cmp)
            .then((hasOnboardingAccess) => {
                if (hasOnboardingAccess) {
                    var taskId = helper.getTaskIdFromUrl(cmp);
                    if (taskId) {
                        cmp.set("v.taskId", taskId);
                        helper.setFlowAPIName(cmp, taskId);
                    }
                }
            });
    },

    flowStatusChange: function (cmp) {
        var payload = {
            type: "FlowStatusChange"
        };
        cmp.find("messageChannel").publish(payload);
    },

    onMessage: function (cmp, event, helper) {
        var taskDetails = event.getParam("taskDetails");
        if (event && event.getParam("type") && taskDetails) {
            if (event.getParam("type") === "FlowRequest") {
                helper.handleMessageChannelEvent(
                    cmp,
                    taskDetails.taskId,
                    taskDetails.flowAPIName
                );
            }
        }
    }
});
